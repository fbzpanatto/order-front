import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FetchPermissionsService } from '../../../../shared/services/fetchPermissions.service';
import { environment } from '../../../../../environments/environment';
import { SuccessGET } from '../../../../shared/interfaces/response/response';
import { AsideService, paths } from '../../../../shared/services/aside.service';
import { ToolbarMenuService } from '../../../../shared/services/toolbarMenu.service';

export interface Role {
  role_id: number,
  role_name: string,
  created_at: string,
  updated_at: string
}

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './permissions-list.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/table.scss']
})
export class PermissionsListComponent {

  #roles?: Role[]

  #route = inject(ActivatedRoute)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #http = inject(FetchPermissionsService)

  async ngOnInit() {
    this.asideFilters()
    // this.menuSettings()

    await this.getAll()
  }

  async getAll() { this.roles = ((await this.#http.getAll() as SuccessGET).data) as Role[] }

  asideFilters() { this.#asideService.getResourceFilters(this.path) }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get roles() { return this.#roles }
  set roles(value: Role[] | undefined) { this.#roles = value }

  get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }

}
