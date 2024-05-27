import { Component } from '@angular/core';
import { AsideComponent } from "../../../core/components/aside.component";

@Component({
    selector: 'app-products-list',
    standalone: true,
    templateUrl: './products-list.component.html',
    styleUrl: './products-list.component.scss',
    imports: [AsideComponent]
})
export class ProductsListComponent {

}
