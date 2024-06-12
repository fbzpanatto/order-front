import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-orders-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './orders-list.component.html',
    styleUrls: ['../../../styles/resource.scss', '../../../styles/table.scss']
})
export class OrdersListComponent {

    #route = inject(ActivatedRoute)
    #toolbarMenuService = inject(ToolbarMenuService)

    ngOnInit() {
        this.menuSettings()
    }

    menuSettings() {
        this.#toolbarMenuService.menuName = this.menuName
        this.#toolbarMenuService.hasFilter = this.hasFilter
      }

    get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
    get menuName() { return this.#route.snapshot.data[environment.MENU] as string }
}
