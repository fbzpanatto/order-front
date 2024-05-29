import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authChildGuard } from './core/guards/authChild.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./features/home/components/home.component').then(m => m.HomeComponent),
    data: {
      menu: 'default'
    },
  },
  {
    path: 'customers',
    title: 'Clientes',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/customers/components/customers-list.component').then(m => m.CustomersListComponent),
        data: {
          menu: 'default'
        },
      },
      {
        path: ':command',
        loadComponent: () => import('./features/customers/components/customers-form.component').then(m => m.CustomersFormComponent),
      },
    ]
  },
  {
    path: 'orders',
    title: 'Pedidos',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/orders/components/orders-list.component').then(m => m.OrdersListComponent),
        data: {
          menu: 'default'
        },
      },
      {
        path: ':command',
        loadComponent: () => import('./features/orders/components/orders-form.component').then(m => m.OrdersFormComponent),
      },
    ]
  },
  {
    path: 'products',
    title: 'Produtos',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/products/components/products-list.component').then(m => m.ProductsListComponent),
        data: {
          menu: 'default'
        },
      },
      {
        path: ':command',
        loadComponent: () => import('./features/products/components/products-form.component').then(m => m.ProductsFormComponent),
      },
    ]
  },
  {
    path: 'user',
    title: 'Configurações do Usuário',
    loadComponent: () => import('./features/users/components/users.component').then(m => m.UsersComponent),
    data: {
      menu: 'settings'
    },
    canActivate: [authGuard]
  },
  {
    path: 'parameters',
    title: 'Parâmetros do Sistema',
    loadComponent: () => import('./features/parameters/components/parameters.component').then(m => m.ParametersComponent),
    data: {
      menu: 'settings'
    },
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    title: 'Login',
    outlet: 'login',
    loadComponent: () => import('./features/login/components/login.component').then(m => m.LoginComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./features/home/components/home.component').then(m => m.HomeComponent),
    data: {
      menu: 'default'
    },
  }
];
