import { Component } from '@angular/core';
import { AsideComponent } from "../../../core/components/aside.component";

@Component({
    selector: 'app-customers-list',
    standalone: true,
    templateUrl: './customers-list.component.html',
    styleUrl: './customers-list.component.scss',
    imports: [AsideComponent]
})
export class CustomersListComponent {

}
