import { Component, OnDestroy, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { FetchCustomerService } from '../../../shared/services/fetchCustomer.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SuccessGETbyId, SuccessPATCH, SuccessPOST } from '../../../shared/interfaces/response/response';
import { FormService } from '../../../shared/services/form.service';

interface Contact { id: number | null, contact: string, phone_number: string }

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss', '../../../styles/resource.scss']
})
export class CustomersFormComponent implements OnDestroy {

  contactNameControl = new FormControl<string>('')
  contactPhoneControl = new FormControl<string>('')

  contactNameSignal = toSignal(this.contactNameControl.valueChanges)
  contactPhoneSignal = toSignal(this.contactPhoneControl.valueChanges)

  #title?: string
  #personId?: number
  counter: number = 1
  contacts: Contact[] = []
  addContactState = true

  #router = inject(Router)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #fetchCustomerService = inject(FetchCustomerService)
  #person = {}

  normalForm = this.fb.group({
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
    contacts: [[{}]],
    address: this.fb.group({ ...this.address }),
  })

  legalForm = this.fb.group({
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
    contacts: [[{}]],
    address: this.fb.group({ ...this.address }),
  })

  constructor(private fb: FormBuilder) {
    effect(() => { this.contactValidation() })
  }

  async ngOnInit() {


    this.#asideService.changeCustomerType(this.customerTypeUrlParam as string)

    this.canProced()
    this.menuSettings()
    this.titleSettings()

    this.#formService.currentForm = this.form;

    if (!isNaN(Number(this.command))) {
      this.personId = parseInt(this.command as string)
      this.person = await this.getByPersonId(this.personId)
      return this.person != undefined ? this.updateFormValues(this.person) : null
    }

    if (this.command != 'new') { return this.redirect() }
  }

  ngOnDestroy(): void {
    this.#formService.originalValues = {}
  }

  updateFormValues(person: any) {

    this.form.patchValue(person);
    this.#formService.originalValues = this.form.value;

    this.contacts = this.person.contacts
    this.updateCounter()
  }

  updateCounter() {
    this.contacts.length ? this.counter = (this.contacts[this.contacts.length - 1].id!) + 1 : null
  }

  async getByPersonId(personId: number) { return (await this.#fetchCustomerService.getById(personId) as SuccessGETbyId).data }

  contactValidation() {

    const name = this.contactNameSignal()
    const phone = this.contactPhoneSignal()

    const nameCondition = (name != null && name != undefined) && (name.length >= 3 && name.length <= 60)
    const phoneCondition = (phone != null && phone != undefined) && (phone.length >= 11 && phone.length <= 14 && this.isNumeric(phone))

    this.addContactState = !(nameCondition && phoneCondition)
  }

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

  createContact() {

    const contact = {
      id: null,
      contact: this.contactNameControl.value as string,
      phone_number: this.contactPhoneControl.value as string
    }

    this.contacts = [...this.contacts, contact]

    this.form.controls['contacts'].patchValue(this.contacts)

    this.addContactState = true
    this.contactNameControl.reset()
    this.contactPhoneControl.reset()
  }

  updatingContact(idx: number, str: string, value: string) {
    if (str === 'contact') {
      this.contacts[idx].contact = value;
    } else {
      this.contacts[idx].phone_number = value;
    }

    this.contacts = [...this.contacts]

    // Atualizar o controle de contatos no formulário
    this.form.controls['contacts'].patchValue([...this.contacts])

    // Recalcular a diferença
    this.#formService.originalValues = this.form.value;
  }



  removeContact(item: Contact) {
    // TODO: create popup before delete
    this.contacts = [...this.contacts.filter(el => el !== item)]
    this.form.controls['contacts'].patchValue(this.contacts)
  }

  async onSubmit() {
    if (this.command === 'new') {
      const response = await this.#fetchCustomerService.saveData(this.form.value)
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    if (!isNaN(Number(this.command))) {
      const response = await this.#fetchCustomerService.updateData(this.personId as number, this.form.value)
      if (!(response as SuccessPATCH).affectedRows) { return }
      return this.redirect()
    }
  }

  isNumeric(str: string): boolean { return str.match(/^\d+$/) !== null }


  get getDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get personId() { return this.#personId }
  set personId(value: number | undefined) { this.#personId = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get person() { return this.#person }
  set person(value: any) { this.#person = value }

  get customerType() { return this.#asideService.customerType() }
  get command() { return this.#route.snapshot.paramMap.get('command') }
  get customerTypeUrlParam() { return this.#route.snapshot.paramMap.get('type') }

  get form() { return this.customerType === 'legal' ? this.legalForm : this.normalForm }
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
      }]
    }
  }
}