import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'customers',
    title: 'Clientes',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/customers/components/customers-list.component').then(m => m.CustomersListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/customers/components/customers-form.component').then(m => m.CustomersFormComponent)
      },
    ]
  },
  {
    path: 'orders',
    title: 'Pedidos',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/orders/components/orders-list.component').then(m => m.OrdersListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/orders/components/orders-form.component').then(m => m.OrdersFormComponent)
      },
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  }
];
