import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FormService } from '../../../../shared/services/form.service';
import { Option } from '../../../../shared/components/select.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectComponent } from '../../../../shared/components/select.component';
import { ToolbarMenuService } from '../../../../shared/services/toolbarMenu.service';
import { FetchSegmentsService } from '../../../../shared/services/fetch-segments.service';
import { FetchCompaniesService } from '../../../../shared/services/fetchCompanies.service';
import { SuccessGETbyId, SuccessPOST, SuccessPATCH, SuccessGET } from '../../../../shared/interfaces/response/response';

@Component({
  selector: 'app-segments-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SelectComponent],
  templateUrl: './segments-form.component.html',
  styleUrls: ['../../../../styles/form.scss', '../../../../styles/title-bar.scss'],
})
export class SegmentsFormComponent {

  #title?: string

  #segment = {}
  #currentCompany?: Option
  #companies: Option[] = []
  #arrOfCompanies: any[] = []

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #http = inject(FetchSegmentsService)
  #compHttp = inject(FetchCompaniesService);
  #toolbarMenuService = inject(ToolbarMenuService)

  form = this.#fb.group({
    company_id: [null, { validators: [Validators.required] }],
    segment_id: [null, {}],
    name: [null, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)] }],
    social_name: [null],
    cnpj: [null]
  })

  async ngOnInit() {

    this.menuSettings()
    this.titleSettings()

    this.#formService.originalValues = this.form.value;
    this.#formService.currentForm = this.form;

    if (this.idIsTrue) {
      const response = await this.getBySegmentId(this.queryParams)
      this.segment = response.data
      this.companies = response.meta.extra.companies!.map((el: any) => { return { id: el.company_id, label: el.corporate_name, value: el.company_id } })
      return this.segment != undefined ? this.updateFormValues(this.segment) : null
    }
    await this.getCompanies()
  }

  async getCompanies() {
    const response = (await this.#compHttp.getAll({})) as SuccessGET;
    this.#arrOfCompanies = response.data as []
    this.companies = response.data.map((el: any) => { return { id: el.company_id, label: el.corporate_name, value: el.company_id } })
  }

  async getBySegmentId(queryParams: { [key: string]: any }) { return (await this.#http.getSegments(queryParams) as SuccessGETbyId) }

  redirect() { this.#router.navigate(['/parameters/segments']) }

  titleSettings() { this.action !== 'new' ? this.title = 'Editando' : this.title = 'Novo Segmento' }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  updateFormValues(segment: any) {
    this.currentCompany = this.companies.find(el => el.id === segment.company_id)
    this.#formService.originalValues = this.form.value;
    this.form.patchValue(segment)
  }

  setCurrentOption(e: Option, control: string) {
    this.form.get(control)?.patchValue(e.value)
    if (control === 'company_id') {
      const company = this.#arrOfCompanies.find((c: any) => c.company_id === e.id)
      this.form.get('social_name')?.patchValue(company.social_name)
      this.form.get('cnpj')?.patchValue(company.cnpj)
    }
  }

  async onSubmit() {

    const values = this.form.value

    if (!this.idIsTrue) {
      const response = await this.#http.saveData({ company_id: values.company_id, segment_id: values.segment_id, name: values.name })
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    const response = await this.#http.updateData(this.queryParams, { company_id: values.company_id, segment_id: values.segment_id, name: values.name })
    if (!(response as SuccessPATCH).affectedRows) { return }
    return this.redirect()
  }

  get currentCompany() { return this.#currentCompany }
  set currentCompany(value: Option | undefined) { this.#currentCompany = value }

  get companies() { return this.#companies }
  set companies(value: Option[]) { this.#companies = value }

  get segment() { return this.#segment }
  set segment(value: any) { this.#segment = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get action() { return this.#route.snapshot.queryParamMap.get('action') }
  get company_id() { return parseInt(this.#route.snapshot.queryParamMap.get('company_id') as string) }
  get segment_id() { return parseInt(this.#route.snapshot.queryParamMap.get('segment_id') as string) }

  get queryParams() { return { company_id: this.company_id, segment_id: this.segment_id } }

  get idIsTrue() { return (this.action != environment.NEW || this.action === null) && (!isNaN(this.segment_id) && !isNaN(this.company_id)) }
}
