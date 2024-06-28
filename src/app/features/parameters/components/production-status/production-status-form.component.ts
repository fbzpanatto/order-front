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


@Component({
  selector: 'app-production-status-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, SelectComponent ],
  templateUrl: './production-status-form.component.html',
  styleUrls: ['../../../../styles/form.scss', '../../../../styles/title-bar.scss'],
})
export class ProductionStatusFormComponent {

  #title?: string

  #status = {}
  #currentCompany?: Option
  #companies: Option[] = []

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
    name: [null, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)] }]
  })

  async ngOnInit() {

    this.menuSettings()
    this.titleSettings()

    this.#formService.originalValues = this.form.value;
    this.#formService.currentForm = this.form;

    if (this.has_id) {
      const response = await this.getById(this.queryParams)
      this.status = response.data

      this.companies = response.meta.extra.companies!
        .map((el: any) => { return { id: el.company_id, label: el.corporate_name, value: el.company_id } })

      return this.status != undefined ? this.updateFormValues(this.status) : null
    }
    await this.getCompanies()
  }

  async getCompanies() {
    const response = await this.#compHttp.getAll({})
    this.companies = (response as SuccessGET).data
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

  updateFormValues(segment: any) {
    this.currentCompany = this.companies.find(el => el.id === segment.company_id)
    this.#formService.originalValues = this.form.value;
    this.form.patchValue(segment)
  }

  setCurrentOption(e: Option, control: string) { this.form.get(control)?.patchValue(e.value) }

  async onSubmit() {
    const values = this.form.value
    if (!this.has_id) {

      const response = await this.#http
        .saveData({ company_id: values.company_id, status_id: values.status_id, name: values.name })

      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    const response = await this.#http
      .updateData(this.queryParams, { company_id: values.company_id, status_id: values.status_id, name: values.name })

    if (!(response as SuccessPATCH).affectedRows) { return }
    return this.redirect()
  }

  get currentCompany() { return this.#currentCompany }
  set currentCompany(value: Option | undefined) { this.#currentCompany = value }

  get companies() { return this.#companies }
  set companies(value: Option[]) { this.#companies = value }

  get status() { return this.#status }
  set status(value: any) { this.#status = value }

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
