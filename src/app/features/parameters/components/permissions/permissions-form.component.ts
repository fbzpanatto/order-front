import { CommonModule } from '@angular/common';
import { Role } from './permissions-list.component';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FormService } from '../../../../shared/services/form.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from "../../../../shared/components/select.component";
import { Component, OnDestroy, inject } from '@angular/core';
import { PermissionsService } from '../../../../shared/services/permissions.service';
import { SuccessGET, SuccessGETbyId, SuccessPATCH, SuccessPOST } from '../../../../shared/interfaces/response/response';
import { FetchPermissionsService } from '../../../../shared/services/fetchPermissions.service';
import { Option } from '../../../../shared/components/select.component';
import { Company } from '../../../companies/components/companies-list.component';
import { FetchCompaniesService } from '../../../../shared/services/fetchCompanies.service';

@Component({
  selector: 'app-permissions-form',
  standalone: true,
  templateUrl: './permissions-form.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/form.scss', '../../../../styles/table.scss'],
  imports: [ReactiveFormsModule, CommonModule, SelectComponent]
})
export class PermissionsFormComponent implements OnDestroy {

  #role = {}
  #currentCompany?: Option
  #companies: Option[] = []
  #arrayOfCompanies: Company[] = []

  #timeoutId: any;
  #title?: string
  #rolesArray: any[] = []
  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #http = inject(FetchPermissionsService)
  #permissions = inject(PermissionsService)
  #companiesHttp = inject(FetchCompaniesService)

  resources = this.#permissions.resources
  form: FormGroup;

  constructor() {
    this.form = this.#fb.group({
      company: this.#fb.group({ company_id: [null] }),
      role: this.#fb.group({ role_id: [null], role_name: ['', { disable: true }] })
    })
  }

  async ngOnInit() {

    this.initializeForm();
    this.titleSettings()

    this.#formService.originalValues = this.form.value;
    this.#formService.currentForm = this.form;

    await this.getCompanies()

    if ((this.action != environment.NEW || this.action === null) && (!isNaN(parseInt(this.role_id as string)) && !isNaN(parseInt(this.company_id as string)))) {
      this.role = await this.getByRoleId({ company_id: parseInt(this.company_id as string), role_id: parseInt(this.role_id as string) })
      return this.role != undefined ? this.updateFormValues(this.role) : null
    }
  }

  ngOnDestroy(): void { if (this.#timeoutId) { clearTimeout(this.#timeoutId) } }

  initializeForm() {
    this.form.get('role_name')?.disable()
    const arr = ['canCreate', 'canRead', 'canUpdate']
    for (let r of this.resources) {
      const fg = this.#fb.group({});
      r.permissions.forEach(ac => {
        arr.includes(ac) ?
          fg.addControl(ac, this.#fb.control(false)) :
          fg.addControl(ac, this.#fb.control(null))
      });
      this.form.addControl(r.resource, fg);
    }
  }

  async getByRoleId(queryParams: { [key: string]: any }) { return (await this.#http.getById(queryParams) as SuccessGETbyId).data }

  updateFormValues(body: any) {

    this.currentCompany = this.companies.find(c => c.id === body.role.company_id)

    this.form.patchValue(body)
    this.#formService.originalValues = this.form.value;
  }

  async getCompanies() {
    const response = (await this.#companiesHttp.getAll() as SuccessGET)
    this.#arrayOfCompanies = response.data as Company[]
    this.companies = ((response.data) as Company[]).map((company) => { return { id: company.company_id, label: company.corporate_name, value: company.company_id } })
  }

  setCurrentOption(e: Option, control: string) {
    if (control === 'company.company_id') {
      const company = this.#arrayOfCompanies.find(c => c.company_id === e.value)
      this.form.get(control)?.patchValue(company?.company_id)
    }
  }

  redirect() { this.#router.navigate(['/parameters/permissions']) }

  setArrayOfOptions(res: Role[]) {
    const options = res.map(el => { return { id: el.role_id, label: el.role_name, value: el.role_name, create: false } })
    this.rolesArray = [...options, { id: res.length ? res.length + 1 : 1, label: 'Adicionar novo', value: 'Adicionar novo', create: true }]
  }

  titleSettings() { this.action !== environment.NEW ? this.title = 'Editando Permissões' : this.title = 'Criando Permissões' }

  async onSubmit() {
    if (this.action === environment.NEW) {
      const response = await this.#http.saveData(this.currentValues)
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    if (!isNaN(Number(this.action))) {
      const response = await this.#http.updateData(parseInt(this.role_id as string), this.currentValues)
      if (!(response as SuccessPATCH).affectedRows) { return }
      return this.redirect()
    }
  }

  get currentCompany() { return this.#currentCompany }
  set currentCompany(value: Option | undefined) { this.#currentCompany = value }

  get companies() { return this.#companies }
  set companies(value: Option[]) { this.#companies = value }

  get role() { return this.#role }
  set role(value: any) { this.#role = value }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get rolesArray() { return this.#rolesArray }
  set rolesArray(value: any[]) { this.#rolesArray = value }

  get action() { return this.#route.snapshot.queryParamMap.get('action') }
  get company_id() { return this.#route.snapshot.queryParamMap.get('company_id') }
  get role_id() { return this.#route.snapshot.queryParamMap.get('role_id') }
}
