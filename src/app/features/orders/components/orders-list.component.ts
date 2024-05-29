import { Component, inject } from '@angular/core';
import { AsideComponent } from "../../../core/components/aside.component";
import { CommonModule } from '@angular/common';
import { AsideConditionAnimation } from '../../../shared/animations/asideAnimation';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';

@Component({
    selector: 'app-orders-list',
    standalone: true,
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.scss', '../../../styles/resource.scss'],
    imports: [AsideComponent, CommonModule],
    animations: [AsideConditionAnimation]
})
export class OrdersListComponent {

    private route = inject(ActivatedRoute)
    private toolbarMenuService = inject(ToolbarMenuService)

    ngOnInit() {
        this.toolbarMenuService.currentMenu = this.route.snapshot.data[environment.MENU]
    }
}
