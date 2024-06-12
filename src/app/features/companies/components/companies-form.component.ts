import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../shared/services/form.service';
import { FetchCompaniesService } from '../../../shared/services/fetchCompanies.service';
import { SuccessGETbyId, SuccessPOST } from '../../../shared/interfaces/response/response';
import { format } from 'date-fns';

@Component({
  selector: 'app-companies-form',
  standalone: true,
  templateUrl: './companies-form.component.html',
  styleUrls: ['./companies-form.component.scss', '../../../styles/resource.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class CompaniesFormComponent {

  #title?: string

  #company = {}
  #companyId?: number

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #http = inject(FetchCompaniesService)
  #toolbarMenuService = inject(ToolbarMenuService)

  form = this.#fb.group({
    company: this.#fb.group({ ...this.companyFormFields }),
    address: this.#fb.group({ ...this.address })
  })

  async ngOnInit() {
    this.menuSettings()
    this.titleSettings()

    this.#formService.currentForm = this.form;

    if (!isNaN(Number(this.command))) {
      this.companyId = parseInt(this.command as string)
      this.company = await this.getByCompanyId(this.companyId)
      return this.company != undefined ? this.updateFormValues(this.company) : null
    }

    if (this.command != 'new') { return this.redirect() }
  }

  async getByCompanyId(companyId: number) { return (await this.#http.getById(companyId) as SuccessGETbyId).data }

  redirect() { this.#router.navigate(['/users']) }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  updateFormValues(company: any) {
    this.form.patchValue(company)
    this.#formService.originalValues = this.form.value;
  }

  async onSubmit() {
    if (this.command === 'new') {
      const response = await this.#http.saveData(this.formDiff)

      console.log('response', response)

      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
  }

  formatDate(date: Date): string {
    const localDate = new Date(date.getTime() + (3 * 60 * 60 * 1000));
    return format(localDate, 'yyyy-MM-dd HH:mm:ss');
  }

  titleSettings() { this.command !== 'new' ? this.title = 'Editando' : this.title = 'Nova Empresa' }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get command() { return this.#route.snapshot.paramMap.get('command') }

  get company() { return this.#company }
  set company(value: any) { this.#company = value }

  get companyId() { return this.#companyId }
  set companyId(value: number | undefined) { this.#companyId = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get companyFormFields() {
    return {
      id: [null],
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
      active: [true]
    }
  }

  get address() {
    return {
      id: [null],
      company_id: [null],
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
      add_uf: ['', {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      }],
      add_neighborhood: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      }]
    }
  }
}
