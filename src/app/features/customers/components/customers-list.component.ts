import { Component, effect, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { paths } from '../../../shared/services/aside.service';
import { FetchCustomerService } from '../../../shared/services/fetchCustomer.service';

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
    #fetchCustomerService = inject(FetchCustomerService)
    #customersArray?: any[]

    constructor() {
        effect(() => { this.getAll() })
    }

    ngOnInit() {
        this.asideFilters()
        this.menuSettings()
    }

    async getAll() {
        const response = await this.#fetchCustomerService.getAll()
        this.customersArray = response.data
    }

    asideFilters() { this.#asideService.getResourceFilters(this.path) }

    menuSettings() {
        this.#toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]
        this.#toolbarMenuService.hasFilter = true
    }

    get customersArray() { return this.#customersArray }
    set customersArray(value: any[] | undefined) { this.#customersArray = value }

    get asideFlag() { return this.#asideService.flag }
    get customerType() { return this.#asideService.customerType }
    get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }
}