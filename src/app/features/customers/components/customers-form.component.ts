import { Component, OnDestroy, inject } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { Company } from '../../companies/components/companies-list.component';
import { FetchCompaniesService } from '../../../shared/services/fetchCompanies.service';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  templateUrl: './customers-form.component.html',
  styleUrls: ['../../../styles/resource.scss', '../../../styles/form.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CustomersFormComponent implements OnDestroy {

  contactNameControl = new FormControl<string>('')
  contactPhoneControl = new FormControl<string>('')

  #title?: string
  #customerId?: number
  addContactState = true
  #companiesArray?: Company[]

  #fb = inject(FormBuilder)
  #router = inject(Router)
  #subscription?: Subscription
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #asideService = inject(AsideService)
  #dialogService = inject(DialogService)
  #customersHttp = inject(FetchCustomerService)
  #companiesHttp = inject(FetchCompaniesService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #customer = {}

  contactId?: number

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

    this.#formService.originalValues = this.form.value;
    
    this.#asideService.changeCustomerType(this.customerTypeUrlParam as string)

    this.canProced()
    this.menuSettings()
    this.titleSettings()

    await this.getCompanies()

    this.#formService.currentForm = this.form;

    if (!isNaN(Number(this.command))) {
      this.customerId = parseInt(this.command as string)
      this.customer = await this.getByPersonId(this.customerId)
      return this.customer != undefined ? this.updateFormValues(this.customer) : null
    }

    if (this.command != 'new') { return this.redirect() }
  }

  async getCompanies() { this.companiesArray = ((await this.#companiesHttp.getAll() as SuccessGET).data) as Company[] }

  ngOnDestroy(): void {
    this.#subscription?.unsubscribe()
    this.#formService.originalValues = {}
  }

  updateFormValues(person: any) {

    this.form.patchValue(person);

    for (let contact of person.contacts) {
      const formArray = this.#fb.group({
        id: [contact.id],
        person_id: [contact.person_id],
        contact: new FormControl(contact.contact, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)] }),
        phone_number: new FormControl(contact.phone_number, { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(14), Validators.pattern(/^\d+$/)] })
      })
      this.contacts.push(formArray)
      this.contacts.updateValueAndValidity()
    }

    this.#formService.originalValues = this.form.value;
  }

  setContacts(contacts: any[]) {
    const contactFGs = contacts.map(contact => this.#fb.group(contact));
    const contactFormArray = this.#fb.array(contactFGs);

    ((this.form as any).get('contacts') as FormArray).push(contactFormArray)
    this.contacts.updateValueAndValidity()
  }

  async getByPersonId(personId: number) { return (await this.#customersHttp.getById(personId) as SuccessGETbyId).data }

  canProced() {
    return !((this.customerType && this.customerType === 'normal') || (this.customerType && this.customerType === 'legal')) ?
      this.redirect() : null
  }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  titleSettings() {
    if (this.command !== 'new') { this.title = 'Editando' }
    else { this.title = this.customerType === 'legal' ? 'Novo cliente Jurídico' : 'Novo cliente Físico' }
  }

  redirect() { this.#router.navigate(['/customers']) }

  addContact() {

    this.contacts.updateValueAndValidity()

    const formArray = this.#fb.group({
      id: [null],
      person_id: [this.customerId ?? null],
      contact: [null],
      phone_number: [null]
    })

    this.contacts.push(formArray)

    return
  }

  async removeContact(idx: number) {

    const contact = ((this.form as any).get('contacts') as FormArray).at(idx).value

    if (contact.id != null) {
      this.#dialogService.message = `Deseja remover ${contact.contact} ${contact.phone_number}? da lista de contatos?`
      this.#dialogService.showDialog = true

      let subscription: Subscription

      subscription = this.#dialogService.subject.subscribe(async value => {
        if (!value) { return }
        const response = await this.#customersHttp.deleteContact(contact.person_id, contact.id)
        if (!(response as SuccessDELETE).affectedRows) { return }
        return ((this.form as any).get('contacts') as FormArray).removeAt(idx)
      })

      this.#subscription?.add(subscription)

    } else { ((this.form as any).get('contacts') as FormArray).removeAt(idx) }
  }

  async onSubmit() {
    if (this.command === 'new') {
      const response = await this.#customersHttp.saveData(this.formDiff)
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    if (!isNaN(Number(this.command))) {
      const response = await this.#customersHttp.updateData(this.customerId as number, this.formDiff)
      if (!(response as SuccessPATCH).affectedRows) { return }
      return this.redirect()
    }
  }

  isNumeric(str: string): boolean { return str.match(/^\d+$/) !== null }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get contacts() {
    if (!(this.form as any).get('contacts')) return new FormArray([]) as unknown as FormArray
    return (this.form as any).get('contacts') as FormArray
  }

  get companiesArray() { return this.#companiesArray }
  set companiesArray(value: Company[] | undefined) { this.#companiesArray = value }

  get customerId() { return this.#customerId }
  set customerId(value: number | undefined) { this.#customerId = value }

  get customer() { return this.#customer }
  set customer(value: any) { this.#customer = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get customerType() { return this.#asideService.customerType() }
  get command() { return this.#route.snapshot.paramMap.get('command') }
  get customerTypeUrlParam() { return this.#route.snapshot.paramMap.get('type') }

  get form() { return this.customerType === 'legal' ? this.legalForm : this.normalForm }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get company() {
    return {
      company_id: [null, {
        validators: [Validators.required]
      }],
      corporate_name: [null],
      social_name: [null],
      cnpj: [null, {
        validators: [Validators.pattern(/^\d+$/)]
      }]
    }
  }

  get legalCustomer() {
    return {
      person_id: [null],
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
      id: [null],
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