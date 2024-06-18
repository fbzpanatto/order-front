import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { FormService } from '../../../../shared/services/form.service';
import { Option } from '../../../../shared/components/select.component';
import { SelectComponent } from '../../../../shared/components/select.component';
import { FetchFieldService } from '../../../../shared/services/fetchField.service';
import { ToolbarMenuService } from '../../../../shared/services/toolbarMenu.service';
import { FetchResourceService } from '../../../../shared/services/fetchResource.service';
import { SuccessGETbyId, SuccessPOST, SuccessPATCH, SuccessGET } from '../../../../shared/interfaces/response/response';

interface Resource { id: number, label: string, resource: string, fields: [{ id: number, field: string }] }

@Component({
  selector: 'app-fields-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SelectComponent],
  templateUrl: './fields-form.component.html',
  styleUrls: ['../../../../styles/resource.scss', '../../../../styles/form.scss', '../../../../styles/title-bar.scss'],
})
export class FieldsFormComponent {

  #title?: string

  #field = {}
  #fieldId?: number
  #resources: Option[] = []

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #http = inject(FetchFieldService)
  #httpResources = inject(FetchResourceService)
  #toolbarMenuService = inject(ToolbarMenuService)

  form = this.#fb.group({
    table_id: [''],
    field: [''],
    label: ['']
  })

  async ngOnInit() {

    this.#formService.originalValues = this.form.value;

    this.menuSettings()
    this.titleSettings()

    this.#formService.currentForm = this.form;

    Promise.all([await this.getResources()])

    if (!isNaN(Number(this.command))) {
      this.fieldId = parseInt(this.command as string)
      this.field = await this.getByFieldId(this.fieldId)
      return this.field != undefined ? this.updateFormValues(this.field) : null
    }

    if (this.command != 'new') { return this.redirect() }
  }

  async getByFieldId(companyId: number) { return (await this.#http.getById(companyId) as SuccessGETbyId).data }

  async getResources() {
    const options = ((await this.#httpResources.getAll() as SuccessGET).data) as Resource[]
    this.resources = options.map(o => { return { id: o.id, label: o.label, value: o.id } })
  }

  redirect() { this.#router.navigate(['/parameters/fields']) }

  titleSettings() { this.command !== 'new' ? this.title = 'Editando' : this.title = 'Nova Máscara' }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  setCurrentOption(e: Option, control: string) { this.form.get(control)?.patchValue(e.value) }

  updateFormValues(field: any) {
    this.form.patchValue(field)
    this.#formService.originalValues = this.form.value;
  }

  async onSubmit() {
    if (this.command === 'new') {
      const response = await this.#http.saveData(this.currentValues)
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    if (!isNaN(Number(this.command))) {
      const response = await this.#http.updateData(this.#fieldId as number, this.currentValues)
      if (!(response as SuccessPATCH).affectedRows) { return }
      return this.redirect()
    }
  }

  get resources() { return this.#resources }
  set resources(value: Option[]) { this.#resources = value }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get command() { return this.#route.snapshot.paramMap.get('command') }

  get field() { return this.#field }
  set field(value: any) { this.#field = value }

  get fieldId() { return this.#fieldId }
  set fieldId(value: number | undefined) { this.#fieldId = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

}
