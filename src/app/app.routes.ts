import { Routes } from '@angular/router';
import { OrdersComponent } from './features/orders/orders.component';
import { CustomersComponent } from './features/customers/customers.component';

export const routes: Routes = [
  { path: 'orders', component: OrdersComponent },
  { path: 'customers', component: CustomersComponent }
];
