import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { FetchCustomerService } from '../../../shared/services/fetchCustomer.service';
import { toSignal } from '@angular/core/rxjs-interop';

interface Contact { id: number, name: string, phone: string }

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss', '../../../styles/resource.scss']
})
export class CustomersFormComponent {

  contactNameControl = new FormControl<string>('')
  contactPhoneControl = new FormControl<string>('')

  contactNameSignal = toSignal(this.contactNameControl.valueChanges)
  contactPhoneSignal = toSignal(this.contactPhoneControl.valueChanges)

  #title?: string
  counter: number = 1
  contacts: Contact[] = []
  addContactState = true

  #router = inject(Router)
  #route = inject(ActivatedRoute)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #fetchCustomerService = inject(FetchCustomerService)

  normalForm = this.fb.group({
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
    ...this.address,
  })

  legalForm = this.fb.group({
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
    ...this.address,
  })

  constructor(private fb: FormBuilder) {
    effect(() => {
      const name = this.contactNameSignal()
      const phone = this.contactPhoneSignal()

      if (name && phone) {
        const nameCondition = name.length >= 3 && name.length <= 60
        const phoneCondition = phone.length >= 11 && phone.length <= 14

        this.addContactState = !(nameCondition && phoneCondition)
      }
    })
  }

  ngOnInit(): void {

    this.#asideService.changeCustomerType(this.customerTypeUrlParam as string)

    this.canProced()
    this.menuSettings()
    this.titleSettings()

    if (!isNaN(Number(this.command))) {
      console.log('fetching data by id')
      return
    }

    if (this.command != 'new') { return this.redirect() }

    console.log('creating a new resource')
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
    if (this.command !== 'new') {
      this.title = 'Editando';
    } else if (this.customerType === 'legal') {
      this.title = 'Novo cliente Jurídico';
    } else {
      this.title = 'Novo cliente Físico';
    }
  }

  redirect() { this.#router.navigate(['/customers']) }

  createRow() {

    const nameInput = this.contactNameControl
    const contactInput = this.contactPhoneControl

    const contact = {
      id: this.counter,
      name: nameInput.value as string,
      phone: contactInput.value as string
    }

    this.contacts = [...this.contacts, contact]
    this.counter++

    this.form.controls['contacts'].patchValue(this.contacts)

    this.addContactState = true
    nameInput.reset()
    contactInput.reset()
  }

  removeContact(item: Contact) {
    // TODO: create popup before delete
    this.contacts = [...this.contacts.filter(el => el !== item)]
    this.form.controls['contacts'].patchValue(this.contacts)
  }

  async onSubmit() {
    if (this.command === 'new') {
      const response = await this.#fetchCustomerService.saveData(this.form.value)
      this.redirect()
    }
  }

  get form() { return this.customerType === 'legal' ? this.legalForm : this.normalForm }
  get address() {
    return {
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

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }
  get customerType() { return this.#asideService.customerType() }
  get command() { return this.#route.snapshot.paramMap.get('command') }
  get customerTypeUrlParam() { return this.#route.snapshot.paramMap.get('type') }
}