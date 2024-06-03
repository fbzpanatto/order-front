import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';

interface Contact { id: number, name: string, phone: string }

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss', '../../../styles/resource.scss']
})
export class CustomersFormComponent {

  contactName = viewChild<ElementRef>("contactName");
  contactPhone = viewChild<ElementRef>("contactPhone");

  #router = inject(Router)
  #route = inject(ActivatedRoute)
  #toolbarMenuService = inject(ToolbarMenuService)
  #asideService = inject(AsideService)
  #title?: string
  contacts: Contact[] = []
  counter: number = 1

  normalForm = this.fb.group({
    first_name: ['', {
      validators: [Validators.required, Validators.minLength(3)],
    }],
    middle_name: ['', {
      validators: [Validators.minLength(3)],
    }],
    last_name: ['', {
      validators: [Validators.required, Validators.minLength(3)],
    }],
    cpf: ['', {
      validators: [Validators.required, Validators.minLength(3)],
    }],
    contacts: [[], {}],
    ...this.address,
  })

  legalForm = this.fb.group({
    corporate_name: ['', {
      validators: [Validators.required, Validators.minLength(3)],
    }],
    social_name: ['', {
      validators: [Validators.minLength(3)],
    }],
    cnpj: ['', {
      validators: [Validators.required, Validators.minLength(3)],
    }],
    state_registration: ['', {
      validators: [Validators.required, Validators.minLength(3)],
    }],
    contacts: [[], {}],
    ...this.address,
  })

  constructor(private fb: FormBuilder) { }

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

  createRow(name: string, phone: string) {

    if (name.length >= 3 && phone.length >= 10) {

      const contactNameInput = this.contactName()?.nativeElement as HTMLInputElement
      const contactPhoneInput = this.contactPhone()?.nativeElement as HTMLInputElement

      const contact = { id: this.counter, name, phone }
      this.contacts = [...this.contacts, contact]
      this.counter++

      contactNameInput.value = ''
      contactPhoneInput.value = ''
    }
  }

  removeContact(item: Contact) { this.contacts = [...this.contacts.filter(el => el !== item)] }

  get form() { return this.customerType === 'legal' ? this.legalForm : this.normalForm }
  get address() {
    return {
      add_street: ['', {
        validators: [Validators.required, Validators.minLength(3)],
      }],
      add_number: ['', {
        validators: [Validators.minLength(3)],
      }],
      add_zipcode: ['', {
        validators: [Validators.required, Validators.minLength(3)],
      }],
      add_city: ['', {
        validators: [Validators.required, Validators.minLength(3)],
      }],
      add_neighborhood: ['', {
        validators: [Validators.required, Validators.minLength(3)],
      }]
    }
  }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }
  get customerType() { return this.#asideService.customerType() }
  get command() { return this.#route.snapshot.paramMap.get('command') }
  get customerTypeUrlParam() { return this.#route.snapshot.paramMap.get('type') }
}