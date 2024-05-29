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
          menu: 'default'
        },
      },
      {
        path: ':command',
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
        loadComponent: () => import('./features/orders/components/orders-list.component').then(m => m.OrdersListComponent),
        data: {
          menu: 'default'
        },
      },
      {
        path: ':command',
        loadComponent: () => import('./features/orders/components/orders-form.component').then(m => m.OrdersFormComponent)
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
          menu: 'default'
        },
      },
      {
        path: ':command',
        loadComponent: () => import('./features/products/components/products-list.component').then(m => m.ProductsListComponent)
      },
    ]
  },
  {
    path: 'user',
    title: 'Configurações do Usuário',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/users/components/users.component').then(m => m.UsersComponent),
        data: {
          menu: 'settings'
        },
      }
    ]
  },
  {
    path: 'parameters',
    title: 'Parâmetros do Sistema',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/parameters/components/parameters.component').then(m => m.ParametersComponent),
        data: {
          menu: 'settings'
        },
      }
    ]
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
