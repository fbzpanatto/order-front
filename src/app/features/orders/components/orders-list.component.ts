import { Component } from '@angular/core';
import { AsideComponent } from "../../../core/components/aside.component";

@Component({
    selector: 'app-orders-list',
    standalone: true,
    templateUrl: './orders-list.component.html',
    styleUrl: './orders-list.component.scss',
    imports: [AsideComponent]
})
export class OrdersListComponent {

}
