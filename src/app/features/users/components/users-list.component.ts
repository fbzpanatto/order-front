import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { AsideService, paths } from '../../../shared/services/aside.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss', '../../../styles/resource.scss']
})
export class UsersListComponent {

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

  get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }
}
