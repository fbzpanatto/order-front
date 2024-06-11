import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AsideService } from '../../../shared/services/aside.service';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.scss'
})
export class UsersFormComponent {

  #route = inject(ActivatedRoute)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit(): void {
    this.menuSettings()
  }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

}
