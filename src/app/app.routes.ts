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
    loadComponent: () => import('./features/home/components/home.component').then((m) => m.HomeComponent),
    data: { menu: 'default', filter: true },
  },
  {
    path: 'customers',
    title: 'Clientes',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/customers/components/customers-list.component').then((m) => m.CustomersListComponent),
        data: { menu: 'default', filter: true },
      },
      {
        path: 'form',
        loadComponent: () => import('./features/customers/components/customers-form.component').then((m) => m.CustomersFormComponent),
        data: { menu: 'default', filter: false, },
      },
    ],
  },
  {
    path: 'orders',
    title: 'Pedidos',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/orders/components/orders-list.component').then((m) => m.OrdersListComponent),
        data: {
          menu: 'default',
          filter: true,
        },
      },
      {
        path: ':command',
        loadComponent: () => import('./features/orders/components/orders-form.component').then((m) => m.OrdersFormComponent),
        data: {
          menu: 'default',
          filter: false,
        },
      },
    ],
  },
  {
    path: 'products',
    title: 'Produtos',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/products/components/products-list.component').then((m) => m.ProductsListComponent),
        data: {
          menu: 'default',
          filter: true,
        },
      },
      {
        path: ':command',
        loadComponent: () => import('./features/products/components/products-form.component').then((m) => m.ProductsFormComponent),
        data: {
          menu: 'default',
          filter: false,
        },
      },
    ],
  },
  {
    path: 'users',
    title: 'Usuários',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/users/components/users-list.component').then((m) => m.UsersListComponent),
        // canActivate: [authGuard],
        data: { menu: 'settings', filter: true },
      },
      {
        path: 'form',
        loadComponent: () => import('./features/users/components/users-form.component').then((m) => m.UsersFormComponent),
        data: { menu: 'settings', filter: false },
      },
    ],
  },
  {
    path: 'companies',
    title: 'Empresas',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/companies/components/companies-list.component').then((m) => m.CompaniesListComponent),
        // canActivate: [authGuard],
        data: {
          menu: 'settings',
          filter: true,
        },
      },
      {
        path: ':command',
        loadComponent: () => import('./features/companies/components/companies-form.component').then((m) => m.CompaniesFormComponent),
        data: {
          menu: 'settings',
          filter: false,
        },
      },
    ],
  },
  {
    path: 'parameters',
    title: 'Parâmetros do Sistema',
    loadComponent: () => import('./features/parameters/parameters.component').then((m) => m.ParametersComponent),
    data: { menu: 'settings', filter: false },
    children: [
      {
        path: '',
        redirectTo: '/parameters/fields',
        pathMatch: 'full',
      },
      {
        path: 'segments',
        title: 'Segmentos',
        loadComponent: () => import('./features/parameters/components/segments/segments.component').then((m) => m.SegmentsComponent),
        data: { menu: 'settings', filter: false }
      },
      {
        path: 'fields',
        title: 'Campos',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/parameters/components/fields/fields-list.component').then((m) => m.FieldsListComponent),
            data: { menu: 'settings', filter: false },
          },
          {
            path: 'form',
            loadComponent: () => import('./features/parameters/components/fields/fields-form.component').then((m) => m.FieldsFormComponent),
            data: { menu: 'settings', filter: false },
          },
        ],
      },
      {
        path: 'permissions',
        title: 'Permissões',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/parameters/components/permissions/permissions-list.component').then((m) => m.PermissionsListComponent),
            data: { menu: 'settings', filter: true },
          },
          {
            path: 'form',
            loadComponent: () => import('./features/parameters/components/permissions/permissions-form.component').then((m) => m.PermissionsFormComponent),
            data: { menu: 'settings', filter: false },
          },
        ],
      },
      {
        path: 'production-status',
        title: 'Status de Produção',
        loadComponent: () => import('./features/parameters/components/production-status/production-status.component').then((m) => m.ProductionStatusComponent),
        data: {
          menu: 'settings',
          filter: false,
        },
      },
    ],
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
    loadComponent: () => import('./features/login/components/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/home/components/home.component').then(
        (m) => m.HomeComponent
      ),
    data: {
      menu: 'default',
      filter: false,
    },
  },
];
