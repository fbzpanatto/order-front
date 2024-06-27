import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FormService } from '../../../../shared/services/form.service';
import { ToolbarMenuService } from '../../../../shared/services/toolbarMenu.service';
import { SuccessGETbyId, SuccessPOST, SuccessPATCH } from '../../../../shared/interfaces/response/response';
import { FetchSegmentsService } from '../../../../shared/services/fetch-segments.service';

@Component({
  selector: 'app-segments-form',
  standalone: true,
  imports: [],
  templateUrl: './segments-form.component.html',
  styleUrls: ['../../../../styles/form.scss', '../../../../styles/title-bar.scss'],
})
export class SegmentsFormComponent {

  #title?: string

  #segment = {}

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #http = inject(FetchSegmentsService)
  #toolbarMenuService = inject(ToolbarMenuService)

  form = this.#fb.group({
    table_id: ['', { validators: [Validators.required] }],
    field_id: ['', { validators: [Validators.required] }],
    company_id: [1, {}],
    label: ['', { validators: [Validators.required, Validators.minLength(3)] }]
  })

  async ngOnInit() {

    this.menuSettings()
    this.titleSettings()

    this.#formService.originalValues = this.form.value;
    this.#formService.currentForm = this.form;

    if (this.idIsTrue) {
      this.segment = (await this.getBySegmentId(this.queryParams))
      return this.segment != undefined ? this.updateFormValues(this.segment) : null
    }
  }

  async getBySegmentId(queryParams: { [key: string]: any }) { return (await this.#http.getById(queryParams) as SuccessGETbyId).data }

  redirect() { this.#router.navigate(['/parameters/segments']) }

  titleSettings() { this.action !== 'new' ? this.title = 'Editando' : this.title = 'Novo Segmento' }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  updateFormValues(field: any) {
    this.#formService.originalValues = this.form.value;
    this.form.patchValue(field)
  }

  async onSubmit() {
    if (!this.idIsTrue) {
      const response = await this.#http.saveData(this.currentValues)
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    const response = await this.#http.updateData(this.queryParams, this.currentValues)
    if (!(response as SuccessPATCH).affectedRows) { return }
    return this.redirect()
  }

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
