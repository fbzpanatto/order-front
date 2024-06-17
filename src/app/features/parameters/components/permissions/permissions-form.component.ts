import { CommonModule } from '@angular/common';
import { Role } from './permissions-list.component';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FormService } from '../../../../shared/services/form.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from "../../../../shared/components/select.component";
import { Component, OnDestroy, inject } from '@angular/core';
import { PermissionsService } from '../../../../shared/services/permissions.service';
import { SuccessGETbyId, SuccessPATCH, SuccessPOST } from '../../../../shared/interfaces/response/response';
import { FetchPermissionsService } from '../../../../shared/services/fetchPermissions.service';

@Component({
  selector: 'app-permissions-form',
  standalone: true,
  templateUrl: './permissions-form.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/form.scss', '../../../../styles/table.scss'],
  imports: [ReactiveFormsModule, CommonModule, SelectComponent]
})
export class PermissionsFormComponent implements OnDestroy {

  #role = {}
  #roleId?: number

  #timeoutId: any;
  #title?: string
  #rolesArray: any[] = []
  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #http = inject(FetchPermissionsService)
  #permissions = inject(PermissionsService)

  resources = this.#permissions.resources
  form: FormGroup;

  constructor() {
    this.form = this.#fb.group({
      role: this.#fb.group({ role_id: [null], role_name: ['', { disable: true }] })
    })
  }

  async ngOnInit() {

    this.initializeForm();
    this.titleSettings()

    this.#formService.originalValues = this.form.value;
    this.#formService.currentForm = this.form;

    if (!isNaN(Number(this.command))) {
      this.roleId = parseInt(this.command as string)
      this.role = await this.getByRoleId(this.roleId)
      return this.role != undefined ? this.updateFormValues(this.role) : null
    }

    if (this.command != environment.NEW) { return this.redirect() }
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

  async getByRoleId(roleId: number) { return (await this.#http.getById(roleId) as SuccessGETbyId).data }

  updateFormValues(role: any) {
    this.form.patchValue(role)
    this.#formService.originalValues = this.form.value;
  }

  redirect() { this.#router.navigate(['/parameters/permissions']) }

  setArrayOfOptions(res: Role[]) {
    const options = res.map(el => { return { id: el.role_id, label: el.role_name, value: el.role_name, create: false } })
    this.rolesArray = [...options, { id: res.length ? res.length + 1 : 1, label: 'Adicionar novo', value: 'Adicionar novo', create: true }]
  }

  titleSettings() { this.command !== environment.NEW ? this.title = 'Editando Permissões' : this.title = 'Criando Permissões' }

  async onSubmit() {
    if (this.command === environment.NEW) {
      const response = await this.#http.saveData(this.currentValues)
      if (!(response as SuccessPOST).affectedRows) { return }
      return this.redirect()
    }
    if (!isNaN(Number(this.command))) {
      const response = await this.#http.updateData(this.roleId as number, this.currentValues)
      if (!(response as SuccessPATCH).affectedRows) { return }
      return this.redirect()
    }
  }

  get role() { return this.#role }
  set role(value: any) { this.#role = value }

  get roleId() { return this.#roleId }
  set roleId(value: number | undefined) { this.#roleId = value }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get rolesArray() { return this.#rolesArray }
  set rolesArray(value: any[]) { this.#rolesArray = value }

  get command() { return this.#route.snapshot.paramMap.get(environment.COMMAND) }
}
