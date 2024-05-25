import { Routes } from '@angular/router';
import { OrdersComponent } from './features/3_orders/orders.component';
import { CustomersComponent } from './features/2_customers/customers.component';

export const routes: Routes = [
  { path: 'orders', component: OrdersComponent },
  { path: 'customers', component: CustomersComponent }
];
