import { Component, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-orders-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.scss', '../../../styles/resource.scss']
})
export class OrdersListComponent {

    #route = inject(ActivatedRoute)
    #asideService = inject(AsideService)
    #toolbarMenuService = inject(ToolbarMenuService)

    ngOnInit() {
        this.menuSettings()
    }

    menuSettings() {
        this.#toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]
        this.#toolbarMenuService.hasFilter = true
    }

    get asideFlag() { return this.#asideService.flag }
}
