import { Component, inject } from '@angular/core';
import { AsideComponent } from "../../../core/components/aside.component";
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { AsideConditionAnimation } from '../../../shared/animations/asideAnimation';

@Component({
    selector: 'app-orders-list',
    standalone: true,
    templateUrl: './orders-list.component.html',
    styleUrl: './orders-list.component.scss',
    imports: [AsideComponent, CommonModule],
    animations: [AsideConditionAnimation]
})
export class OrdersListComponent {

    private asideService = inject(AsideService)

    get asideFlag() { return this.asideService.flag }

}
