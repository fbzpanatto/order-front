import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private fb: FormBuilder) { }

  get resources() {

    const permissions = ['permission_id', 'role_id', 'table_id', 'create', 'read', 'update']

    return [
      {
        id: 1,
        label: 'Clientes',
        resource: 'customers',
        permissions
      },
      {
        id: 2,
        label: 'Empresas',
        resource: 'companies',
        permissions
      },
      {
        id: 3,
        label: 'Pedidos',
        resource: 'orders',
        permissions
      },
      {
        id: 4,
        label: 'Permissões',
        resource: 'permissions',
        permissions
      },
      {
        id: 5,
        label: 'Produtos',
        resource: 'products',
        permissions
      },
      {
        id: 6,
        label: 'Segmentos',
        resource: 'segments',
        permissions
      },
      {
        id: 7,
        label: 'Status do Produto',
        resource: 'productionStatus',
        permissions
      },
      {
        id: 8,
        label: 'Usuários',
        resource: 'users',
        permissions
      }
    ]
  }
}
