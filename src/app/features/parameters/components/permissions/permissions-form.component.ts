import { Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService } from '../../../../shared/services/form.service';
import { CommonModule } from '@angular/common';
import { SelectComponent } from "../../../../shared/components/select.component";
import { FetchRolesService } from '../../../../shared/services/fetchRoles.service';
import { SuccessGET } from '../../../../shared/interfaces/response/response';
import { PermissionsService } from '../../../../shared/services/permissions.service';

@Component({
  selector: 'app-permissions-form',
  standalone: true,
  templateUrl: './permissions-form.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/form.scss', '../../../../styles/table.scss'],
  imports: [ReactiveFormsModule, CommonModule, SelectComponent]
})
export class PermissionsFormComponent implements OnDestroy {

  @ViewChild('newRole', { static: false }) newRole?: ElementRef
  disabled: boolean = true

  #timeoutId: any;
  #title?: string
  #rolesArray: any[] = []
  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #rolesHttp = inject(FetchRolesService)
  #permissions = inject(PermissionsService)

  resources = this.#permissions.resources
  form: FormGroup;

  constructor() { this.form = this.#fb.group({}) }

  async ngOnInit() {
    this.initializeForm();
    this.titleSettings()
    await this.getRoles()
  }

  ngOnDestroy(): void { if (this.#timeoutId) { clearTimeout(this.#timeoutId) } }

  initializeForm() {
    const arr = ['create', 'read', 'update']
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

  async getRoles() { this.setArrayOfOptions(((await this.#rolesHttp.getAll() as SuccessGET).data) as any[]) }

  setArrayOfOptions(res: any[]) {
    this.rolesArray = [...res, { id: res.length ? res.length + 1 : 1, label: 'Adicionar novo', value: 'Adicionar novo', create: true }]
  }

  titleSettings() { this.command !== 'new' ? this.title = 'Editando Permissões' : this.title = 'Criando Permissões' }

  onCreateElement(e: any) {
    this.disabled = false
    this.#timeoutId = setTimeout(() => { this.newRole?.nativeElement.focus() }, 100)
  }

  onSubmit() {

  }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get rolesArray() { return this.#rolesArray }
  set rolesArray(value: any[]) { this.#rolesArray = value }

  get command() { return this.#route.snapshot.paramMap.get('command') }
}