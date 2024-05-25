import { Routes } from '@angular/router';
import { CustomersComponent } from './features/customers/customers.component';
import { OrdersComponent } from './features/orders/orders.component';

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
