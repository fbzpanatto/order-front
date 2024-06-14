import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private fb: FormBuilder) { }

  get resources() {
    return [
      {
        id: 1,
        label: 'Clientes',
        resource: 'customers',
        permissions: ['create', 'read', 'update']
      },
      {
        id: 2,
        label: 'Empresas',
        resource: 'companies',
        permissions: ['create', 'read', 'update']
      },
      {
        id: 3,
        label: 'Pedidos',
        resource: 'orders',
        permissions: ['create', 'read', 'update']
      },
      {
        id: 4,
        label: 'Permissões',
        resource: 'permissions',
        permissions: ['create', 'read', 'update']
      },
      {
        id: 5,
        label: 'Produtos',
        resource: 'products',
        permissions: ['create', 'read', 'update']
      },
      {
        id: 6,
        label: 'Segmentos',
        resource: 'segments',
        permissions: ['create', 'read', 'update']
      },
      {
        id: 7,
        label: 'Status do Produto',
        resource: 'productionStatus',
        permissions: ['create', 'read', 'update']
      },
      {
        id: 8,
        label: 'Usuários',
        resource: 'users',
        permissions: ['create', 'read', 'update']
      }
    ]
  }
}
