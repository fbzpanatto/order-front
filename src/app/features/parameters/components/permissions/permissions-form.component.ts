import { Component, ElementRef, ViewChild, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService } from '../../../../shared/services/form.service';
import { CommonModule } from '@angular/common';
import { SelectComponent } from "../../../../shared/components/select.component";
import { FetchRolesService } from '../../../../shared/services/fetchRoles.service';
import { SuccessGET } from '../../../../shared/interfaces/response/response';

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

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #rolesHttp = inject(FetchRolesService)

  form = this.#fb.group({
  })

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
    setTimeout(() => {
      this.newRole?.nativeElement.focus()
    }, 100)
  }

  onSubmit() {

  }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get rolesArray() { return this.#rolesArray }
  set rolesArray(value: any[]) { this.#rolesArray = value }

  get command() { return this.#route.snapshot.paramMap.get('command') }

  get resources() {
    return [
      {
        "id": 1,
        "label": "Clientes",
        "resource": "customers",
        "separator": ".",
        "permissions": ["create", "read", "update"]
      },
      {
        "id": 2,
        "label": "Empresas",
        "resource": "companies",
        "separator": ".",
        "permissions": ["create", "read", "update"]
      },
      {
        "id": 3,
        "label": "Pedidos",
        "resource": "orders",
        "separator": ".",
        "permissions": ["create", "read", "update"]
      },
      {
        "id": 4,
        "label": "Permissões",
        "resource": "permissions",
        "separator": ".",
        "permissions": ["create", "read", "update"]
      },
      {
        "id": 5,
        "label": "Produtos",
        "resource": "products",
        "separator": ".",
        "permissions": ["create", "read", "update"]
      },
      {
        "id": 6,
        "label": "Segmentos",
        "resource": "segments",
        "separator": ".",
        "permissions": ["create", "read", "update"]
      },
      {
        "id": 7,
        "label": "Status do Produto",
        "resource": "production-status",
        "separator": ".",
        "permissions": ["create", "read", "update"]
      },
      {
        "id": 8,
        "label": "Usuários",
        "resource": "users",
        "separator": ".",
        "permissions": ["create", "read", "update"]
      }
    ]
  }
}
