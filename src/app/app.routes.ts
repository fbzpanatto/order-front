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
        loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent)
      },
    ]
  },
  {
    path: 'orders',
    title: 'Pedidos',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
      },
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  }
];
