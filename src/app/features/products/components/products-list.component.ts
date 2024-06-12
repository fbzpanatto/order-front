import { Component, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-products-list',
    standalone: true,
    templateUrl: './products-list.component.html',
    styleUrls: ['../../../styles/resource.scss', '../../../styles/table.scss', '../../../styles/title-bar.scss'],
    imports: [CommonModule, RouterLink]
})
export class ProductsListComponent {

    #route = inject(ActivatedRoute)
    #asideService = inject(AsideService)
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