import { Component, inject } from '@angular/core';
import { AsideComponent } from "../../../core/components/aside.component";
import { CommonModule } from '@angular/common';
import { AsideConditionAnimation } from '../../../shared/animations/asideAnimation';
import { AsideService } from '../../../shared/services/aside.service';

@Component({
    selector: 'app-products-list',
    standalone: true,
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss', '../../../styles/resource.scss'],
    imports: [AsideComponent, CommonModule],
    animations: [AsideConditionAnimation]
})
export class ProductsListComponent {

    private asideService = inject(AsideService)

    get asideFlag() { return this.asideService.flag }

}
