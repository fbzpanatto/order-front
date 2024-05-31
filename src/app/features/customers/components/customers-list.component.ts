import { Component, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';

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

    ngOnInit() {
        this.menuSettings()
    }

    menuSettings() {
        this.#toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]
        this.#toolbarMenuService.hasFilter = true
    }

    get asideFlag() { return this.#asideService.flag }
}