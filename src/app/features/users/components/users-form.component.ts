import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../shared/services/form.service';
import { SuccessGET, SuccessGETbyId, SuccessPATCH, SuccessPOST } from '../../../shared/interfaces/response/response';
import { Option } from '../../../shared/components/select.component';
import { SelectComponent } from "../../../shared/components/select.component";
import { FetchUserService } from '../../../shared/services/fetchUser.service';
import { FetchCompaniesService } from '../../../shared/services/fetchCompanies.service';

interface CompanyRoles { company_id: number, corporate_name: string, roles: [{ role_id: number, role_name: string }] }
const ACTIVE_OPTIONS = [{ id: 1, label: 'Sim', value: 1 }, { id: 2, label: 'Não', value: 0 }]


@Component({
  selector: 'app-users-form',
  standalone: true,
  templateUrl: './users-form.component.html',
  styleUrls: ['../../../styles/resource.scss', '../../../styles/form.scss', '../../../styles/title-bar.scss'],
  imports: [ReactiveFormsModule, CommonModule, SelectComponent]
})
export class UsersFormComponent {

  #title?: string
  #user = {}
  #companiesRoles: CompanyRoles[] = []

  #rolesOptions: Option[] = []
  #companiesOptions: Option[] = []
  #currentActive?: Option
  #currentCompany?: Option
  #currentRole?: Option

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #http = inject(FetchUserService)
  #httpCompanies = inject(FetchCompaniesService)

  form = this.#fb.group({
    user_id: ['', {}],
    role_id: ['', {
      validators: [Validators.required]
    }],
    company_id: ['', {
      validators: [Validators.required]
    }],
    name: ['', {
      validators: [Validators.required, Validators.minLength(8)]
    }],
    active: ['', {
      validators: [Validators.required]
    }],
    username: ['', {
      validators: [Validators.required, Validators.minLength(3)]
    }],
    password: ['', {
      validators: [Validators.required, Validators.minLength(8)]
    }],
  })

  async ngOnInit() {
    this.menuSettings()
    this.titleSettings()

    this.#formService.originalValues = this.form.value;
    this.#formService.currentForm = this.form;

    if (this.idIsTrue) {
      const response = await this.getByUserId({ company_id: parseInt(this.company_id as string), user_id: parseInt(this.user_id as string), roles: true })
      return this.user != undefined ? this.updateFormValues(response) : null
    }
    await this.getCompanies()
  }

  async getCompanies() {
    this.companiesRoles = (await this.#httpCompanies.getAll({ roles: true }) as SuccessGET).data
    this.companiesOptions = this.companiesRoles.map((company: CompanyRoles) => { return { id: company.company_id, label: company.corporate_name, value: company.company_id } })
  }

  async getByUserId(queryParams: { [key: string]: any }) { return (await this.#http.getById(queryParams) as SuccessGETbyId) }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  updateFormValues(response: any) {
    this.settingSelectOptions(response)

    this.form.patchValue(response.data)
    this.#formService.originalValues = this.form.value;
  }

  settingSelectOptions(response: any) {
    this.companiesRoles = response.meta.companyRoles
    this.companiesOptions = this.companiesRoles.map((company: any) => { return { id: company.company_id, label: company.corporate_name, value: company.company_id } })

    this.currentActive = response.data.active === 1 ? ACTIVE_OPTIONS.find(op => op.id === 1) : ACTIVE_OPTIONS.find(op => op.id === 2)
    this.currentCompany = this.companiesOptions.find(c => c.id === response.data.company_id)
    this.currentRole = this.rolesOptions.find(r => r.id === response.data.role_id)
  }

  async onSubmit() {
    if (!this.idIsTrue) {
      const response = await this.#http.saveData(this.currentValues)
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    const response = await this.#http.updateData({ company_id: parseInt(this.company_id as string), user_id: parseInt(this.user_id as string) }, this.currentValues)
    if (!(response as SuccessPATCH).affectedRows) { return }
    return this.redirect()
  }

  setCurrentOption(e: Option, control: string) {
    this.form.get(control)?.patchValue(e.value)
    if (control === 'company_id') {
      const roles = this.companiesRoles.find((c: any) => c.company_id === e.id).roles as { role_id: number, role_name: string }[]
      this.rolesOptions = roles.map(r => { return { id: r.role_id, label: r.role_name, value: r.role_id } })
      this.currentRole = this.rolesOptions[0]
    }
    Object.keys(this.formDiff).length ? this.form.markAsDirty() : this.form.markAsPristine()
  }

  redirect() { this.#router.navigate(['/users']) }

  titleSettings() { this.command !== 'new' ? this.title = 'Editando' : this.title = 'Novo usuário' }

  get companiesRoles() { return this.#companiesRoles }
  set companiesRoles(value: any) { this.#companiesRoles = value }

  get currentActive() { return this.#currentActive }
  set currentActive(value: Option | undefined) { this.#currentActive = value }

  get currentCompany() { return this.#currentCompany }
  set currentCompany(value: Option | undefined) { this.#currentCompany = value }

  get currentRole() { return this.#currentRole }
  set currentRole(value: Option | undefined) { this.#currentRole = value }

  get command() { return this.#route.snapshot.paramMap.get('command') }

  get active() { return ACTIVE_OPTIONS }

  get rolesOptions() { return this.#rolesOptions }
  set rolesOptions(value: Option[]) { this.#rolesOptions = value }

  get companiesOptions() { return this.#companiesOptions }
  set companiesOptions(value: Option[]) { this.#companiesOptions = value }

  get user() { return this.#user }
  set user(value: any) { this.#user = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get action() { return this.#route.snapshot.queryParamMap.get('action') }
  get company_id() { return this.#route.snapshot.queryParamMap.get('company_id') }
  get user_id() { return this.#route.snapshot.queryParamMap.get('user_id') }

  get idIsTrue() { return (this.action != environment.NEW || this.action === null) && (!isNaN(parseInt(this.user_id as string)) && !isNaN(parseInt(this.company_id as string))) }
}
