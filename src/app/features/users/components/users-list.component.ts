import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { AsideService, paths } from '../../../shared/services/aside.service';
import { FetchUserService } from '../../../shared/services/fetchUser.service';
import { SuccessGET } from '../../../shared/interfaces/response/response';

export interface User { user_id: number, name: string, active: boolean | number, username: string, corporate_name: string, role_name: string, created_at: string }

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-list.component.html',
  styleUrls: ['../../../styles/resource.scss', '../../../styles/table.scss', '../../../styles/title-bar.scss']
})
export class UsersListComponent {

  #usersArray?: User[]
  #route = inject(ActivatedRoute)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #http = inject(FetchUserService)

  async ngOnInit() {
    this.asideFilters()
    this.menuSettings()

    await this.getAll()
  }

  asideFilters() { this.#asideService.getResourceFilters(this.path) }

  async getAll() { this.usersArray = ((await this.#http.getAll() as SuccessGET).data) as User[] }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get usersArray() { return this.#usersArray }
  set usersArray(value: User[] | undefined) { this.#usersArray = value }

  get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }
}
