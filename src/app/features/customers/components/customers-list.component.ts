import { Component, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { AsideFiltersService } from '../../../shared/services/asideFilters.service';
import { paths } from '../../../shared/services/asideFilters.service';

@Component({
    selector: 'app-customers-list',
    standalone: true,
    templateUrl: './customers-list.component.html',
    styleUrls: ['./customers-list.component.scss', '../../../styles/resource.scss'],
    imports: [CommonModule, RouterLink]
})
export class CustomersListComponent {

    #route = inject(ActivatedRoute)
    #asideService = inject(AsideService)
    #toolbarMenuService = inject(ToolbarMenuService)
    #asideFiltersService = inject(AsideFiltersService)

    ngOnInit() {
        this.asideFilters()
        this.menuSettings()
    }

    asideFilters() { this.#asideFiltersService.path = this.path }

    menuSettings() {
        this.#toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]
        this.#toolbarMenuService.hasFilter = true
    }

    get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }
    get asideFlag() { return this.#asideService.flag }
}