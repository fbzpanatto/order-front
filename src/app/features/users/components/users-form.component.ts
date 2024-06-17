import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../shared/services/form.service';
import { FetchPermissionsService } from '../../../shared/services/fetchPermissions.service';
import { SuccessGET } from '../../../shared/interfaces/response/response';
import { Role } from '../../parameters/components/permissions-list.component';
import { Option } from '../../../shared/components/select.component';
import { SelectComponent } from "../../../shared/components/select.component";
import { FetchCompaniesService } from '../../../shared/services/fetchCompanies.service';
import { Company } from '../../companies/components/companies-list.component';

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
  #userId?: number
  #roles: Option[] = []
  #companies: Option[] = []

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #httpPermissions = inject(FetchPermissionsService)
  #httpCompanies = inject(FetchCompaniesService)

  form = this.#fb.group({
    user_id: [''],
    role_id: ['', {
      validators: [Validators.required]
    }],
    company_id: ['', {
      validators: [Validators.required]
    }],
    name: ['', {
      validators: [Validators.required]
    }],
    active: [''],
    username: ['', {
      validators: [Validators.required]
    }],
    password: ['', {
      validators: [Validators.required]
    }],
  })

  async ngOnInit() {
    this.menuSettings()
    this.titleSettings()

    this.#formService.currentForm = this.form;

    if (!isNaN(Number(this.command))) {
      this.userId = parseInt(this.command as string)
      this.user = await this.getByUserId(this.userId)
      return this.user != undefined ? this.updateFormValues(this.user) : null
    }

    if (this.command != 'new') { return this.redirect() }

    await this.getRoles()
    await this.getCompanies()
  }

  async getRoles() {
    const options = ((await this.#httpPermissions.getAll() as SuccessGET).data) as Role[]
    this.roles = options.map(role => { return { id: role.role_id, label: role.role_name, value: role.role_name } })
  }

  async getCompanies() {
    const options = ((await this.#httpCompanies.getAll() as SuccessGET).data) as Company[]
    this.companies = options.map(company => { return { id: company.company_id, label: company.corporate_name, value: company.corporate_name } })
  }

  async getByUserId(userId: number) {
    // TODO
  }

  redirect() { this.#router.navigate(['/users']) }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  updateFormValues(user: any) {
    this.form.patchValue(user)
    this.#formService.originalValues = this.form.value;
  }

  onSubmit() {

  }

  setCurrentOption(e: Option, control: string) {
    console.log(this.form.get('user.role'))
  }

  titleSettings() { this.command !== 'new' ? this.title = 'Editando' : this.title = 'Novo usuário' }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get command() { return this.#route.snapshot.paramMap.get('command') }

  get roles() { return this.#roles }
  set roles(value: Option[]) { this.#roles = value }

  get companies() { return this.#companies }
  set companies(value: Option[]) { this.#companies = value }

  get user() { return this.#user }
  set user(value: any) { this.#user = value }

  get userId() { return this.#userId }
  set userId(value: number | undefined) { this.#userId = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }
}
