import { Component, inject } from '@angular/core';
import { Option, SelectComponent} from "../../../../shared/components/select.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import { FormService } from "../../../../shared/services/form.service";
import { FetchCompaniesService } from "../../../../shared/services/fetchCompanies.service";
import { ToolbarMenuService } from "../../../../shared/services/toolbarMenu.service";
import { SuccessGET, SuccessGETbyId, SuccessPATCH, SuccessPOST } from "../../../../shared/interfaces/response/response";
import { environment } from "../../../../../environments/environment";
import { FetchProductionStatusService } from "../../../../shared/services/fetch-production-status.service";
import { CommonModule } from "@angular/common";

interface CompanyStatus { company_id: number, corporate_name: string, productStatus: { company_id: number, status_id: number, name: string }[] }

@Component({
  selector: 'app-production-status-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, SelectComponent ],
  templateUrl: './production-status-form.component.html',
  styleUrls: ['../../../../styles/form.scss', '../../../../styles/title-bar.scss'],
})
export class ProductionStatusFormComponent {

  #title?: string

  status = {}

  currentCompany?: Option
  currentStatus?: Option

  companiesOptions: Option[] = []
  statusOptions: Option[] = []

  statusComOptions: Option[] = []
  companies: CompanyStatus[] = []

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #http = inject(FetchProductionStatusService)
  #compHttp = inject(FetchCompaniesService);
  #toolbarMenuService = inject(ToolbarMenuService)

  form = this.#fb.group({
    company_id: [null, { validators: [Validators.required] }],
    status_id: [null, {}],
    next_status_id: [null, {}],
    name: [null, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)] }]
  })

  async ngOnInit() {

    this.menuSettings()
    this.titleSettings()

    this.#formService.originalValues = this.form.value;
    this.#formService.currentForm = this.form;

    await this.getCompanies()

    if (this.has_id) {
      const response = await this.getById(this.queryParams)
      this.status = response.data

      this.companiesOptions = response.meta.extra.companies!
        .map((el: any) => { return { id: el.company_id, label: el.corporate_name, value: el.company_id } })

      return this.status != undefined ? this.updateFormValues(this.status) : null
    }
  }

  async getCompanies() {
    const response = (await this.#compHttp.getAll({ status: true }) as SuccessGET).data
    this.companies = response as CompanyStatus[]
    this.companiesOptions = response
      .map((el: any) => { return { id: el.company_id, label: el.corporate_name, value: el.company_id } })
  }

  async getById(queryParams: { [key: string]: any }) {
    return await this.#http.getStatus(queryParams) as SuccessGETbyId
  }

  redirect() { this.#router.navigate(['/parameters/production-status']) }

  titleSettings() { this.action !== 'new' ? this.title = 'Editando' : this.title = 'Novo Status' }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  updateFormValues(body: any) {
    this.currentCompany = this.companiesOptions.find(el => el.id === body.company_id)
    const company = this.companies.find(c => c.company_id === body.company_id)
    this.statusOptions = company?.productStatus.map(s => { return { id: s.status_id, label: s.name, value: s.status_id } }) as Option[]
    this.currentStatus = this.statusOptions.find(el => el.id === body.next_status_id)

    this.#formService.originalValues = this.form.value;
    this.form.patchValue(body)
  }

  setCurrentOption(e: Option, control: string, formControlChildName?: string) {
    this.form.get(control)?.patchValue(e.value)
    if (formControlChildName === 'next_status_id') {

      const value = this.form.get('company_id')?.value
      const company = this.companies.find(c => c.company_id === value!)

      if(this.has_id) {
        this.statusOptions = company?.productStatus
          .map(s => { return { id: s.status_id, label: s.name, value: s.status_id } })
          .filter(o => { return o.id !== parseInt(this.form.get('status_id')?.value as unknown as string) }) as Option[]
        return this.form.markAsDirty()
      }

      this.statusOptions = company?.productStatus.map(s => { return { id: s.status_id, label: s.name, value: s.status_id } }) as Option[]
      this.form.markAsDirty()
    }
  }

  async onSubmit() {
    const values = this.form.value
    if (!this.has_id) {

      const response = await this.#http
        .saveData(values)

      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    const response = await this.#http
      .updateData(this.queryParams, values)

    if (!(response as SuccessPATCH).affectedRows) { return }
    return this.redirect()
  }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get action() { return this.#route.snapshot.queryParamMap.get('action') }
  get company_id() { return this.#route.snapshot.queryParamMap.get('company_id') }
  get status_id() { return this.#route.snapshot.queryParamMap.get('status_id') }

  get queryParams() { return { company_id: this.company_id, status_id: this.status_id } }

  get has_id() {
    const actionCondition = this.action != environment.NEW || this.action === null
    const idCondition = !isNaN(parseInt(this.status_id as string)) && !isNaN(parseInt(this.company_id as string))
    return actionCondition && idCondition
  }
}
