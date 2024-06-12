import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { AsideService, paths } from '../../../shared/services/aside.service';

interface User { id: number, name: string, active: boolean, username: string, company: string, role: string, created_at: string }

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-list.component.html',
  styleUrls: ['../../../styles/resource.scss', '../../../styles/table.scss']
})
export class UsersListComponent {

  #usersArray?: User[]
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

  get usersArray() { return this.#usersArray }
  set usersArray(value: User[] | undefined) { this.#usersArray = value }

  get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }
}
