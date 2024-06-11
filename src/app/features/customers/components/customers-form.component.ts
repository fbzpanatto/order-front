import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { FetchCustomerService } from '../../../shared/services/fetchCustomer.service';
import { SuccessDELETE, SuccessGETbyId, SuccessPATCH, SuccessPOST } from '../../../shared/interfaces/response/response';
import { FormService } from '../../../shared/services/form.service';
import { format } from 'date-fns';
import { DialogService } from '../../../shared/services/dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss', '../../../styles/resource.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class CustomersFormComponent implements OnDestroy {

  contactNameControl = new FormControl<string>('')
  contactPhoneControl = new FormControl<string>('')

  #title?: string
  #customerId?: number
  counter: number = 1
  addContactState = true

  userChoice?: boolean

  #fb = inject(FormBuilder)
  #router = inject(Router)
  #subscription?: Subscription
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #asideService = inject(AsideService)
  #dialogService = inject(DialogService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #fetchCustomerService = inject(FetchCustomerService)
  #customer = {}

  contactId?: number

  normalForm = this.#fb.group({
    customer: this.#fb.group({ ...this.normalCustomer }),
    contacts: this.#fb.array([]),
    address: this.#fb.group({ ...this.address }),
    person: this.#fb.group({ ...this.person })
  })

  legalForm = this.#fb.group({
    customer: this.#fb.group({ ...this.legalCustomer }),
    contacts: this.#fb.array([]),
    address: this.#fb.group({ ...this.address }),
    person: this.#fb.group({ ...this.person })
  })

  async ngOnInit() {

    this.#asideService.changeCustomerType(this.customerTypeUrlParam as string)

    this.canProced()
    this.menuSettings()
    this.titleSettings()

    this.#formService.currentForm = this.form;

    if (!isNaN(Number(this.command))) {
      this.customerId = parseInt(this.command as string)
      this.customer = await this.getByPersonId(this.customerId)
      return this.customer != undefined ? this.updateFormValues(this.customer) : null
    }

    if (this.command != 'new') { return this.redirect() }
  }

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

  async getByPersonId(personId: number) { return (await this.#fetchCustomerService.getById(personId) as SuccessGETbyId).data }

  canProced() {
    return !((this.customerType && this.customerType === 'normal') || (this.customerType && this.customerType === 'legal')) ?
      this.redirect() : null
  }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]
    this.#toolbarMenuService.hasFilter = false
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
      person_id: [this.customerId ?? ''],
      contact: [''],
      phone_number: ['']
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
        const response = await this.#fetchCustomerService.deleteContact(contact.person_id, contact.id)
        if (!(response as SuccessDELETE).affectedRows) { return }
        return ((this.form as any).get('contacts') as FormArray).removeAt(idx)
      })

      this.#subscription?.add(subscription)

    } else { ((this.form as any).get('contacts') as FormArray).removeAt(idx) }
  }

  async onSubmit() {
    if (this.command === 'new') {
      const response = await this.#fetchCustomerService.saveData(this.formDiff)
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    if (!isNaN(Number(this.command))) {
      const response = await this.#fetchCustomerService.updateData(this.customerId as number, this.formDiff)
      if (!(response as SuccessPATCH).affectedRows) { return }
      return this.redirect()
    }
  }

  isNumeric(str: string): boolean { return str.match(/^\d+$/) !== null }

  formatDate(date: Date): string {
    const localDate = new Date(date.getTime() + (3 * 60 * 60 * 1000));
    return format(localDate, 'yyyy-MM-dd HH:mm:ss');
  }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get contacts() {
    if (!(this.form as any).get('contacts')) return new FormArray([]) as unknown as FormArray
    return (this.form as any).get('contacts') as FormArray
  }

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

  get legalCustomer() {
    return {
      person_id: [''],
      cnpj: ['', {
        validators: [Validators.required, Validators.minLength(14), Validators.maxLength(14)],
      }],
      corporate_name: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      }],
      social_name: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      }],
      state_registration: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(9)],
      }],
      created_at: [''],
    }
  }

  get normalCustomer() {
    return {
      person_id: [''],
      cpf: ['', {
        validators: [Validators.required, Validators.minLength(11), Validators.maxLength(11)],
      }],
      first_name: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      }],
      middle_name: ['', {
        validators: [Validators.minLength(2), Validators.maxLength(60)],
      }],
      last_name: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      }],
      created_at: [''],
    }
  }

  get address() {
    return {
      id: [''],
      person_id: [''],
      add_street: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      }],
      add_number: ['', {
        validators: [Validators.maxLength(10)],
      }],
      add_zipcode: ['', {
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      }],
      add_city: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      }],
      add_neighborhood: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      }],
      created_at: [''],
    }
  }

  get person() {
    return {
      id: [''],
      observation: ['', {
        validators: [Validators.minLength(3), Validators.maxLength(45)],
      }],
      first_field: ['', {
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }],
      second_field: ['', {
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }],
      third_field: ['', {
        validators: [Validators.minLength(3), Validators.maxLength(100)],
      }]
    }
  }
}