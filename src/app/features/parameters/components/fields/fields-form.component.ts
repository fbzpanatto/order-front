import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { FormService } from '../../../../shared/services/form.service';
import { Option } from '../../../../shared/components/select.component';
import { SelectComponent } from '../../../../shared/components/select.component';
import { FetchFieldService } from '../../../../shared/services/fetchField.service';
import { ToolbarMenuService } from '../../../../shared/services/toolbarMenu.service';
import { FetchResourceService } from '../../../../shared/services/fetchResource.service';
import { SuccessGETbyId, SuccessPOST, SuccessPATCH, SuccessGET } from '../../../../shared/interfaces/response/response';

interface Field { id: number, field: string, label: string }
interface Resource { id: number, label: string, resource: string, fields: Field[] }

@Component({
  selector: 'app-fields-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SelectComponent],
  templateUrl: './fields-form.component.html',
  styleUrls: ['../../../../styles/form.scss', '../../../../styles/title-bar.scss'],
})
export class FieldsFormComponent {

  #title?: string

  #field = {}
  #fieldId?: number

  #tables?: Resource[]

  #currentTable?: Option
  #tableOptions: Option[] = []

  #currentField?: Option
  #fieldOptions: Option[] = []

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #http = inject(FetchFieldService)
  #httpResources = inject(FetchResourceService)
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

    await this.getResources()

    if (this.idIsTrue) {
      this.field = (await this.getByFieldId(this.queryParams))
      return this.field != undefined ? this.updateFormValues(this.field) : null
    }
  }

  async getByFieldId(queryParams: { [key: string]: any }) { return (await this.#http.getById(queryParams) as SuccessGETbyId).data }

  async getResources() {
    this.tables = ((await this.#httpResources.getAll() as SuccessGET).data) as Resource[]
    this.tableOptions = this.tables.map((o: Resource) => { return { id: o.id, label: o.label, value: o.id } })
  }

  redirect() { this.#router.navigate(['/parameters/fields']) }

  titleSettings() { this.command !== 'new' ? this.title = 'Editando' : this.title = 'Nova Máscara' }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  setCurrentOption(e: Option, control: string, formControlChildName?: string) {
    this.form.get(control)?.patchValue(e.value)
    const value = this.form.get(control)?.value
    if (formControlChildName === 'field_id') {
      this.fieldOptions = this.tables?.find(r => r.id === value)?.fields.map(o => { return { id: o.id, label: o.label, value: o.id } }) as Option[]
      // this.currentTableField = this.resourceFieldsOptions[0]
    }
  }

  updateFormValues(field: any) {
    this.currentTable = this.tableOptions?.find(r => r.id === field.table_id)
    this.fieldOptions = this.tables?.find(r => r.id === field.table_id)?.fields.map(o => { return { id: o.id, label: o.label, value: o.id } }) as Option[]
    this.currentField = this.fieldOptions.find(r => r.id === field.field_id)
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

  get command() { return this.#route.snapshot.paramMap.get('command') }

  get currentTable() { return this.#currentTable }
  set currentTable(value: Option | undefined) { this.#currentTable = value }

  get currentField() { return this.#currentField }
  set currentField(value: Option | undefined) { this.#currentField = value }

  get fieldOptions() { return this.#fieldOptions }
  set fieldOptions(value: Option[]) { this.#fieldOptions = value }

  get tables() { return this.#tables }
  set tables(value: Resource[] | undefined) { this.#tables = value }

  get tableOptions() { return this.#tableOptions }
  set tableOptions(value: Option[]) { this.#tableOptions = value }

  get field() { return this.#field }
  set field(value: any) { this.#field = value }

  get fieldId() { return this.#fieldId }
  set fieldId(value: number | undefined) { this.#fieldId = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get action() { return this.#route.snapshot.queryParamMap.get('action') }
  get company_id() { return this.#route.snapshot.queryParamMap.get('company_id') }
  get table_id() { return this.#route.snapshot.queryParamMap.get('table_id') }
  get field_id() { return this.#route.snapshot.queryParamMap.get('field_id') }

  get queryParams() { return { company_id: parseInt(this.company_id as string), table_id: parseInt(this.table_id as string), field_id: parseInt(this.field_id as string) } }

  get idIsTrue() { return (this.action != environment.NEW || this.action === null) && (!isNaN(parseInt(this.table_id as string)) && !isNaN(parseInt(this.company_id as string)) && !isNaN(parseInt(this.field_id as string))) }
}
