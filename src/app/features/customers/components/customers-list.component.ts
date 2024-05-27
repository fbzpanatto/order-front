import { Component, inject } from '@angular/core';
import { AsideComponent } from "../../../core/components/aside.component";
import { AsideService } from '../../../shared/services/aside.service';
import { ConditionAnimation } from './animation';

@Component({
    selector: 'app-customers-list',
    standalone: true,
    templateUrl: './customers-list.component.html',
    styleUrl: './customers-list.component.scss',
    imports: [AsideComponent],
    animations: [ConditionAnimation]
})
export class CustomersListComponent {

    private asideService = inject(AsideService)

    get asideFlag() { return this.asideService.flag }
}
