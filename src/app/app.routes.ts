import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
    children: [
      {
        path: '',
        loadComponent: () => import('./features/customers/components/customers-list.component').then(m => m.CustomersListComponent),
        data: {
          menu: 'default',
          filter: true
        },
      },
      {
        path: ':command',
        // canActivate: [authGuard],
        loadComponent: () => import('./features/customers/components/customers-form.component').then(m => m.CustomersFormComponent),
        data: {
          menu: 'default',
          filter: false
        },
      },

    ]
  },
  {
    path: 'orders',
    title: 'Pedidos',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/orders/components/orders-list.component').then(m => m.OrdersListComponent),
        data: {
          menu: 'default',
          filter: true
        },
      },
      {
        path: ':command',
        canActivate: [authGuard],
        loadComponent: () => import('./features/orders/components/orders-form.component').then(m => m.OrdersFormComponent),
        data: {
          menu: 'default',
          filter: false
        },
      },
    ]
  },
  {
    path: 'products',
    title: 'Produtos',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/products/components/products-list.component').then(m => m.ProductsListComponent),
        data: {
          menu: 'default',
          filter: true
        },
      },
      {
        path: ':command',
        canActivate: [authGuard],
        loadComponent: () => import('./features/products/components/products-form.component').then(m => m.ProductsFormComponent),
        data: {
          menu: 'default',
          filter: false
        },
      },
    ]
  },
  {
    path: 'user',
    title: 'Configurações do Usuário',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/components/users.component').then(m => m.UsersComponent),
    data: {
      menu: 'settings',
      filter: false
    }
  },
  {
    path: 'parameters',
    title: 'Parâmetros do Sistema',
    canActivate: [authGuard],
    loadComponent: () => import('./features/parameters/components/parameters.component').then(m => m.ParametersComponent),
    data: {
      menu: 'settings',
      filter: false
    }
  },
  {
    path: 'login',
    redirectTo: '/home(login:auth)',
    pathMatch: 'full',
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
      menu: 'default',
      filter: false
    },
  }
];
