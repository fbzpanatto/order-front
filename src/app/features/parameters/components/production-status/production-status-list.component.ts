import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AsideService, paths } from "../../../../shared/services/aside.service";
import { ToolbarMenuService } from "../../../../shared/services/toolbarMenu.service";
import { SuccessGET } from "../../../../shared/interfaces/response/response";
import { environment } from "../../../../../environments/environment";
import { FetchProductionStatusService } from "../../../../shared/services/fetch-production-status.service";

@Component({
  selector: 'app-production-status',
  standalone: true,
  imports: [],
  templateUrl: './production-status-list.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/table.scss']
})
export class ProductionStatusListComponent {

  #productionStatus?: any[]

  #route = inject(ActivatedRoute)
  #http = inject(FetchProductionStatusService)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #router = inject(Router)

  async ngOnInit() {
    this.asideFilters()
    this.menuSettings()

    await this.getAll()
  }

  async getAll() { this.productionStatus = ((await this.#http.getSegments({ company_id: 1 }) as SuccessGET).data) as any[] }

  asideFilters() { this.#asideService.getResourceFilters(this.path) }

  navigateTo(queryParams: { [key: string]: any }) {
    this.#router.navigate(['/parameters/production-status/form'], { queryParams })
  }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get productionStatus() { return this.#productionStatus }
  set productionStatus(value: any[] | undefined) { this.#productionStatus = value }

  get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }
}
