import { Component, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { AsideFiltersService, paths } from '../../../shared/services/asideFilters.service';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss', '../../../styles/resource.scss'],
    imports: [CommonModule]
})
export class HomeComponent {

    #route = inject(ActivatedRoute)
    #asideService = inject(AsideService)
    #toolbarMenuService = inject(ToolbarMenuService)
    #asideFiltersService = inject(AsideFiltersService)

    ngOnInit() {

        this.asideFilters()
        this.menuSettings()
    }

    asideFilters() { this.#asideFiltersService.changePath(this.path) }

    menuSettings() {
        this.#toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]
        this.#toolbarMenuService.hasFilter = true
    }

    get path() { return this.#route.snapshot.routeConfig?.path as paths }
    get asideFlag() { return this.#asideService.flag }
}
