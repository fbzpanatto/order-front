import { Routes } from '@angular/router';
import { HomeComponent } from './features/1_home/home.component';
import { CustomersComponent } from './features/2_customers/customers.component';
import { OrdersComponent } from './features/3_orders/orders.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'customers', component: CustomersComponent }
];
