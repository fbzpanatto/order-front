import { Component, inject } from '@angular/core';
import { AsideComponent } from "../../../core/components/aside.component";
import { AsideService } from '../../../shared/services/aside.service';
import { AsideConditionAnimation } from '../../../shared/animations/asideAnimation';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-customers-list',
    standalone: true,
    templateUrl: './customers-list.component.html',
    styleUrl: './customers-list.component.scss',
    imports: [AsideComponent, CommonModule],
    animations: [AsideConditionAnimation]
})
export class CustomersListComponent {
    
    private asideService = inject(AsideService)

    get asideFlag() { return this.asideService.flag }
}
