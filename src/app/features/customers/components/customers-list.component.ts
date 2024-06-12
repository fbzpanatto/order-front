import { Component, effect, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { paths } from '../../../shared/services/aside.service';
import { FetchCustomerService } from '../../../shared/services/fetchCustomers.service';
import { SuccessGET } from '../../../shared/interfaces/response/response';

@Component({
    selector: 'app-customers-list',
    standalone: true,
    templateUrl: './customers-list.component.html',
    styleUrls: ['../../../styles/resource.scss', '../../../styles/table.scss', '../../../styles/title-bar.scss'],
    imports: [CommonModule, RouterLink]
})
export class CustomersListComponent {

    #route = inject(ActivatedRoute)
    #asideService = inject(AsideService)
    #toolbarMenuService = inject(ToolbarMenuService)
    #http = inject(FetchCustomerService)
    #customersArray?: any[]

    constructor() { effect(() => { this.getAll() }) }

    ngOnInit() {
        this.asideFilters()
        this.menuSettings()
    }

    async getAll() { this.customersArray = (await this.#http.getAll() as SuccessGET).data }

    asideFilters() { this.#asideService.getResourceFilters(this.path) }

    menuSettings() {
        this.#toolbarMenuService.menuName = this.menuName
        this.#toolbarMenuService.hasFilter = this.hasFilter
    }

    get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
    get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

    get customersArray() { return this.#customersArray }
    set customersArray(value: any[] | undefined) { this.#customersArray = value }

    get customerType() { return this.#asideService.customerType }
    get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }
}