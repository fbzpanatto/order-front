import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  get resources() {

    const permissions = ['permission_id', 'role_id', 'company_id', 'canCreate', 'canRead', 'canUpdate']

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
        resource: 'production_status',
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
