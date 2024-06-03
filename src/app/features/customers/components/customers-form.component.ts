import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss', '../../../styles/resource.scss']
})
export class CustomersFormComponent {

  #router = inject(Router)
  #route = inject(ActivatedRoute)
  #toolbarMenuService = inject(ToolbarMenuService)
  #asideService = inject(AsideService)
  #title?: string

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.#asideService.changeCustomerType(this.path as string)

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
  get legalForm() {
    return this.fb.group({
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
      ...this.address
    })
  }
  get normalForm() {
    return this.fb.group({
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
      ...this.address
    })
  }
  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }
  get path() { return this.#route.snapshot.paramMap.get('type') }
  get customerType() { return this.#asideService.customerType() }
  get command() { return this.#route.snapshot.paramMap.get('command') }
}
