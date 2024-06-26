import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToolbarMenuService } from '../../shared/services/toolbarMenu.service';

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],

})
export class ParametersComponent {

  #route = inject(ActivatedRoute)
  #toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit() {
    this.menuSettings()
  }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get menuArray() {
    return [
      {
        id: 1,
        routerLink: 'fields',
        iClass: 'fa-solid fa-pen-to-square',
        title: 'Campos'
      },
      {
        id: 2,
        routerLink: 'permissions',
        iClass: 'fa-solid fa-key',
        title: 'Permissões'
      },
      {
        id: 3,
        routerLink: 'segments',
        iClass: 'fa-solid fa-cube',
        title: 'Segmentos'
      },
      {
        id: 4,
        routerLink: 'production-status',
        iClass: 'fa-solid fa-list-check',
        title: 'Status do Produto'
      },
    ]
  }
}
