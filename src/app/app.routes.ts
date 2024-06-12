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
      menu: 'default',
      filter: true
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
        path: ':type/:command',
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
        loadComponent: () => import('./features/products/components/products-form.component').then(m => m.ProductsFormComponent),
        data: {
          menu: 'default',
          filter: false
        },
      },
    ]
  },
  {
    path: 'users',
    title: 'Usuários',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/users/components/users-list.component').then(m => m.UsersListComponent),
        // canActivate: [authGuard],
        data: {
          menu: 'settings',
          filter: true
        }
      },
      {
        path: ':command',
        loadComponent: () => import('./features/users/components/users-form.component').then(m => m.UsersFormComponent),
        data: {
          menu: 'settings',
          filter: false
        },
      },
    ]
  },
  {
    path: 'companies',
    title: 'Empresas',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/companies/components/companies-list.component').then(m => m.CompaniesListComponent),
        // canActivate: [authGuard],
        data: {
          menu: 'settings',
          filter: true
        }
      },
      {
        path: ':command',
        loadComponent: () => import('./features/companies/components/companies-form.component').then(m => m.CompaniesFormComponent),
        data: {
          menu: 'settings',
          filter: false
        },
      },
    ]
  },
  {
    path: 'parameters',
    title: 'Parâmetros do Sistema',
    loadComponent: () => import('./features/parameters/components/parameters.component').then(m => m.ParametersComponent),
    data: {
      menu: 'settings',
      filter: false
    },
    children: [
      {
        path: '',
        redirectTo: '/parameters/roles',
        pathMatch: 'full',
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/parameters/components/roles.component').then(m => m.RolesComponent),
        data: {
          menu: 'settings',
          filter: false
        }
      },
      {
        path: 'segments',
        loadComponent: () => import('./features/parameters/components/segments.component').then(m => m.SegmentsComponent),
        data: {
          menu: 'settings',
          filter: false
        }
      }
    ]
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
