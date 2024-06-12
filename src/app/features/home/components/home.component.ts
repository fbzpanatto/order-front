import { Component, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { paths } from '../../../shared/services/aside.service';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['../../../styles/resource.scss', '../../../styles/table.scss'],
    imports: [CommonModule]
})
export class HomeComponent {

    #route = inject(ActivatedRoute)
    #asideService = inject(AsideService)
    #toolbarMenuService = inject(ToolbarMenuService)

    ngOnInit() {

        this.asideFilters()
        this.menuSettings()
    }

    asideFilters() { this.#asideService.getResourceFilters(this.path) }

    menuSettings() {
        this.#toolbarMenuService.menuName = this.menuName
        this.#toolbarMenuService.hasFilter = this.hasFilter
      }

    get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
    get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

    get path() { return this.#route.snapshot.routeConfig?.path as paths }
}
