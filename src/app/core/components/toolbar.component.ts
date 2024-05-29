import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsideService } from '../../shared/services/aside.service';
import { BackButtonDirective } from '../../shared/directives/backButton.directive';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';
import { UserMenuAnimation } from '../../shared/animations/userMenuAnimation';
import { UserMenuService } from '../../shared/services/userMenu.service';

interface Menu { id: number, routerLink: string, iClass: string, title: string }

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BackButtonDirective, ClickOutsideDirective],
  animations: [UserMenuAnimation],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  private asideService = inject(AsideService)
  private userMenuService = inject(UserMenuService)

  changeAsideFlag() { this.asideService.changeFlag() }
  changeMenuUserFlag(value?: boolean) { this.userMenuService.changeFlag(value) }

  get asideFlag() { return this.asideService.flag }
  get userMenuFlag() { return this.userMenuService.flag }

  get userMenuOptions() {
    return [

    ]
  }

  get systemOptions(): Menu[] {
    return [
      {
        id: 1,
        routerLink: 'home',
        iClass: 'fa-solid fa-house',
        title: 'Home'
      },
      {
        id: 2,
        routerLink: 'customers',
        iClass: 'fa-solid fa-user-group',
        title: 'Clientes'
      },
      {
        id: 3,
        routerLink: 'orders',
        iClass: 'fa-solid fa-list',
        title: 'Pedidos'
      },
      {
        id: 4,
        routerLink: 'products',
        iClass: 'fa-solid fa-box',
        title: 'Produtos'
      }
    ]
  }
}
