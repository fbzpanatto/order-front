import { AfterViewInit, Component, ElementRef, ViewChild, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
export class PermissionsFormComponent {

  disabled: boolean = true
  @ViewChild('newRole', { static: false }) newRole?: ElementRef

  #title?: string
  #rolesArray: any[] = []
  #resources?: any[]
  #router = inject(Router)
  #fb = inject(FormBuilder)
  #permissions = inject(PermissionsService)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #rolesHttp = inject(FetchRolesService)

  form = this.#permissions.form 

  async ngOnInit() {
    this.titleSettings()
    await this.getRoles()
  }

  async getRoles() { this.setArrayOfOptions(((await this.#rolesHttp.getAll() as SuccessGET).data) as any[]) }

  setArrayOfOptions(res: any[]) {
    this.rolesArray = [...res, { id: res.length ? res.length + 1 : 1, label: 'Adicionar novo', value: 'Adicionar novo', create: true }]
  }

  titleSettings() { this.command !== 'new' ? this.title = 'Editando Permissões' : this.title = 'Criando Permissões' }

  onCreateElement(e: any) {
    this.disabled = false
    setTimeout(() => { this.newRole?.nativeElement.focus() }, 100)
  }

  onSubmit() {

  }

  get resources() { return this.#permissions.resources }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get rolesArray() { return this.#rolesArray }
  set rolesArray(value: any[]) { this.#rolesArray = value }

  get command() { return this.#route.snapshot.paramMap.get('command') }
}
