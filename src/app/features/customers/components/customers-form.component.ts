import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerTypeService } from '../../../shared/services/customerType.service';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss', '../../../styles/resource.scss']
})
export class CustomersFormComponent {

  #router = inject(Router)
  #route = inject(ActivatedRoute)
  #toolbarMenuService = inject(ToolbarMenuService)
  #customerTypeService = inject(CustomerTypeService)
  #formBuilder = Inject(FormBuilder)

  #title?: string

  form = this.#formBuilder({
    name: ['', {
      validators: [Validators.required, Validators.minLength(3)],
    }],
  })

  ngOnInit(): void {

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
      this.redirect() : this.setCustomerType()
  }

  formTitle() {

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

  setCustomerType() { this.#customerTypeService.customerType = this.customerType as string }

  redirect() { this.#router.navigate(['/customers']) }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }
  get command() { return this.#route.snapshot.paramMap.get('command') }
  get customerType() { return this.#route.snapshot.paramMap.get('type') }
}
