import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private fb: FormBuilder) { }

  createForm() {
    let form = this.fb.group({})
    for (let item of this.resources) {
      for (let action of item.permissions) {
        const controlName = item.resource + action
        form.addControl(controlName, this.fb.control(false))
      }
    }
    return form
  }

  get form() { return this.createForm() }

  get resources() {
    return [
      {
        id: 1,
        label: 'Clientes',
        resource: 'customers',
        permissions: ['Create', 'Read', 'Update']
      },
      {
        id: 2,
        label: 'Empresas',
        resource: 'companies',
        permissions: ['Create', 'Read', 'Update']
      },
      {
        id: 3,
        label: 'Pedidos',
        resource: 'orders',
        permissions: ['Create', 'Read', 'Update']
      },
      {
        id: 4,
        label: 'Permissões',
        resource: 'permissions',
        permissions: ['Create', 'Read', 'Update']
      },
      {
        id: 5,
        label: 'Produtos',
        resource: 'products',
        permissions: ['Create', 'Read', 'Update']
      },
      {
        id: 6,
        label: 'Segmentos',
        resource: 'segments',
        permissions: ['Create', 'Read', 'Update']
      },
      {
        id: 7,
        label: 'Status do Produto',
        resource: 'productionStatus',
        permissions: ['Create', 'Read', 'Update']
      },
      {
        id: 8,
        label: 'Usuários',
        resource: 'users',
        permissions: ['Create', 'Read', 'Update']
      }
    ]
  }
}