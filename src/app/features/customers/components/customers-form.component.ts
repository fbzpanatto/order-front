import { Component, DestroyRef, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { FetchCustomerService } from '../../../shared/services/fetchCustomers.service';
import { SuccessDELETE, SuccessGET, SuccessGETbyId, SuccessPATCH, SuccessPOST } from '../../../shared/interfaces/response/response';
import { FormService } from '../../../shared/services/form.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { Company } from '../../companies/components/companies-list.component';
import { FetchCompaniesService } from '../../../shared/services/fetchCompanies.service';
import { SelectComponent } from '../../../shared/components/select.component';
import { Option } from '../../../shared/components/select.component';
import { FetchFieldService } from '../../../shared/services/fetchField.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface CustomFields { id: number, table: string, field: string, label: string }

@Component({
  selector: 'app-customers-form',
  standalone: true,
  templateUrl: './customers-form.component.html',
  styleUrls: ['../../../styles/resource.scss', '../../../styles/form.scss', '../../../styles/title-bar.scss'],
  imports: [ReactiveFormsModule, CommonModule, SelectComponent]
})
export class CustomersFormComponent implements OnDestroy {

  destroyRef = inject(DestroyRef)

  contactNameControl = new FormControl<string>('')
  contactPhoneControl = new FormControl<string>('')

  #customer = {}
  #title?: string
  #customFields?: CustomFields[]
  #currentCompany?: Option
  #companies: Option[] = []
  #arrayOfCompanies: Company[] = []

  #fb = inject(FormBuilder)
  #router = inject(Router)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #asideService = inject(AsideService)
  #dialogService = inject(DialogService)
  #fieldsHttp = inject(FetchFieldService)
  #customersHttp = inject(FetchCustomerService)
  #companiesHttp = inject(FetchCompaniesService)
  #toolbarMenuService = inject(ToolbarMenuService)

  normalForm = this.#fb.group({
    customer: this.#fb.group({ ...this.normalCustomer }),
    person: this.#fb.group({ ...this.person }),
    address: this.#fb.group({ ...this.address }),
    company: this.#fb.group({ ...this.company }),
    contacts: this.#fb.array([]),
  })

  legalForm = this.#fb.group({
    customer: this.#fb.group({ ...this.legalCustomer }),
    person: this.#fb.group({ ...this.person }),
    address: this.#fb.group({ ...this.address }),
    company: this.#fb.group({ ...this.company }),
    contacts: this.#fb.array([]),
  })

  async ngOnInit() {

    this.#asideService.changeCustomerType(this.customerQueryType as string)

    this.canProced()
    this.menuSettings()
    this.titleSettings()

    this.#formService.originalValues = this.form.value;
    this.#formService.currentForm = this.form;

    await this.getCompanies()

    if (this.idIsTrue) {
      this.customer = (await this.getByPersonId({ company_id: parseInt(this.company_id as string), person_id: parseInt(this.person_id as string) }))
      return this.customer != undefined ? this.updateFormValues(this.customer) : null
    }
  }

  async getByPersonId(queryParams: { [key: string]: any }) { return (await this.#customersHttp.getById(queryParams) as SuccessGETbyId).data }

  async getCompanies() {
    const response = (await this.#companiesHttp.getAll({ custom_fields: true }) as SuccessGET)
    this.#arrayOfCompanies = response.data as Company[]
    this.companies = ((response.data) as Company[]).map((company) => { return { id: company.company_id, label: company.corporate_name, value: company.company_id } })
    this.customFields = response.meta.extra
  }

  ngOnDestroy(): void { this.#formService.originalValues = {} }

  updateFormValues(body: any) {

    this.currentCompany = this.companies.find(c => c.id === body.person.company_id)

    for (let contact of body.contacts) {
      const formArray = this.#fb.group({
        person_id: [contact.person_id],
        company_id: [contact.company_id],
        contact_id: [contact.contact_id],
        contact: new FormControl(contact.contact, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)] }),
        phone_number: new FormControl(contact.phone_number, { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(14), Validators.pattern(/^\d+$/)] })
      })
      this.contacts.push(formArray)
      this.contacts.updateValueAndValidity()
    }

    this.form.patchValue(body);
    this.#formService.originalValues = this.form.value;
  }

  async setCurrentOption(e: Option, control: string) {
    if (control === 'person.company_id' && this.form.get(control).value != e.value) {

      const response = ((await this.getCustomFields(e.value) as SuccessGET).data) as CustomFields[]

      if (response) { this.customFields = response }

      for (let contact of this.contacts.value) { contact.company_id = e.value }

      const company = this.#arrayOfCompanies.find(c => c.company_id === e.value)

      this.form.get('customer.company_id').patchValue(company?.company_id)
      this.form.get('address.company_id').patchValue(company?.company_id)

      this.form.get(control).patchValue(company?.company_id)
      this.form.get('company.cnpj').patchValue(company?.cnpj)
      this.form.get('company.social_name').patchValue(company?.social_name)
      this.form.get('company.corporate_name').patchValue(company?.corporate_name)
    }
  }

  async getCustomFields(company_id: number) { return this.#fieldsHttp.getAll({ custom_fields: true, company_id }) }

  canProced() {
    return !((this.customerType && this.customerType === 'normal') || (this.customerType && this.customerType === 'legal')) ?
      this.redirect() : null
  }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  titleSettings() {
    if (this.action !== 'new') { this.title = 'Editando' }
    else { this.title = this.customerType === 'legal' ? 'Novo cliente Jurídico' : 'Novo cliente Físico' }
  }

  async onSubmit() {
    if (!this.idIsTrue) {
      const response = await this.#customersHttp.saveData(this.currentValues)
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    const response = await this.#customersHttp.updateData({ company_id: parseInt(this.company_id as string), person_id: parseInt(this.person_id as string) }, this.currentValues)
    if (!(response as SuccessPATCH).affectedRows) { return }
    return this.redirect()
  }

  redirect() { this.#router.navigate(['/customers']) }

  addContact() {
    this.contacts.updateValueAndValidity()
    const formArray = this.#fb.group({
      contact_id: [null],
      person_id: [this.form.get('person.person_id').value ?? null],
      company_id: [this.form.get('person.company_id').value ?? null],
      contact: [null],
      phone_number: [null]
    })
    this.contacts.push(formArray)
    return
  }

  setContacts(contacts: any[]) {
    const contactFGs = contacts.map(contact => this.#fb.group(contact));
    const contactFormArray = this.#fb.array(contactFGs);

    ((this.form as any).get('contacts') as FormArray).push(contactFormArray)
    this.contacts.updateValueAndValidity()
  }

  async removeContact(idx: number) {

    const contact = ((this.form as any).get('contacts') as FormArray).at(idx).value

    if (contact.contact_id != null) {
      this.#dialogService.message = `Deseja remover ${contact.contact} ${contact.phone_number} da lista de contatos?`
      this.#dialogService.showDialog = true

      this.#dialogService.subject
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(async value => {
          if (!value) { return }
          const response = await this.#customersHttp.deleteContact({ company_id: this.company_id, person_id: this.person_id, contact_id: contact.contact_id })
          if (!(response as SuccessDELETE).affectedRows) { return }
          return ((this.form as any).get('contacts') as FormArray).removeAt(idx)
        })
    } else { ((this.form as any).get('contacts') as FormArray).removeAt(idx) }
  }

  get contacts() {
    if (!(this.form as any).get('contacts')) return new FormArray([]) as unknown as FormArray
    return (this.form as any).get('contacts') as FormArray
  }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get companies() { return this.#companies }
  set companies(value: Option[]) { this.#companies = value }

  get currentCompany() { return this.#currentCompany }
  set currentCompany(value: Option | undefined) { this.#currentCompany = value }

  get customFields() { return this.#customFields }
  set customFields(value: CustomFields[] | undefined) { this.#customFields = value }

  get customer() { return this.#customer }
  set customer(value: any) { this.#customer = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get customerType() { return this.#asideService.customerType() }
  get customerQueryType() { return this.#route.snapshot.queryParamMap.get('type') }

  get form() { return this.customerType === 'legal' ? ((this.legalForm) as any) : ((this.normalForm) as any) }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get company_id() { return this.#route.snapshot.queryParamMap.get('company_id') }
  get person_id() { return this.#route.snapshot.queryParamMap.get('person_id') }
  get action() { return this.#route.snapshot.queryParamMap.get('action') }

  get idIsTrue() { return (this.action != environment.NEW || this.action === null) && (!isNaN(parseInt(this.person_id as string)) && !isNaN(parseInt(this.company_id as string))) }

  get company() {
    return {
      corporate_name: [null],
      social_name: [null],
      cnpj: [null, { validators: [Validators.pattern(/^\d+$/)] }]
    }
  }

  get legalCustomer() {
    return {
      person_id: [null],
      company_id: [null, {
        Validators: [Validators.required]
      }],
      cnpj: [null, {
        validators: [Validators.required, Validators.minLength(14), Validators.maxLength(14), Validators.pattern(/^\d+$/)],
      }],
      corporate_name: [null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      }],
      social_name: [null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      }],
      state_registration: [null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(9), Validators.pattern(/^\d+$/)],
      }]
    }
  }

  get normalCustomer() {
    return {
      person_id: [null],
      company_id: [null, {
        Validators: [Validators.required]
      }],
      cpf: [null, {
        validators: [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d+$/)],
      }],
      first_name: [null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      }],
      middle_name: [null, {
        validators: [Validators.minLength(2), Validators.maxLength(60)],
      }],
      last_name: [null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      }]
    }
  }

  get address() {
    return {
      person_id: [null],
      company_id: [null, {
        Validators: [Validators.required]
      }],
      add_street: [null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      }],
      add_number: [null, {
        validators: [Validators.maxLength(10)],
      }],
      add_zipcode: [null, {
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d+$/)],
      }],
      add_city: [null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      }],
      add_uf: [null, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      }],
      add_neighborhood: [null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      }]
    }
  }

  get person() {
    return {
      person_id: [null],
      company_id: [null, {
        Validators: [Validators.required]
      }],
      observation: [null, {
        validators: [Validators.minLength(3), Validators.maxLength(45)],
      }],
      first_field: [null, {
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }],
      second_field: [null, {
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }],
      third_field: [null, {
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }]
    }
  }
}
