import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FetchPermissionsService } from '../../../../shared/services/fetchPermissions.service';
import { environment } from '../../../../../environments/environment';
import { SuccessGET } from '../../../../shared/interfaces/response/response';
import { AsideService, paths } from '../../../../shared/services/aside.service';
import { ToolbarMenuService } from '../../../../shared/services/toolbarMenu.service';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './permissions-list.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/table.scss']
})
export class PermissionsListComponent {

  #permissionsArray?: any[]

  #route = inject(ActivatedRoute)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #http = inject(FetchPermissionsService)

  async ngOnInit() {
    this.asideFilters()
    // this.menuSettings()

    await this.getAll()
  }

  async getAll() { this.permissionsArray = ((await this.#http.getAll() as SuccessGET).data) as any[] }

  asideFilters() { this.#asideService.getResourceFilters(this.path) }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get permissionsArray() { return this.#permissionsArray }
  set permissionsArray(value: any[] | undefined) { this.#permissionsArray = value }

  get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }

}
