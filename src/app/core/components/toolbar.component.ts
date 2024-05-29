import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsideService } from '../../shared/services/aside.service';
import { BackButtonDirective } from '../../shared/directives/backButton.directive';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';
import { UserMenuAnimation } from '../../shared/animations/userMenuAnimation';
import { UserMenuService } from '../../shared/services/userMenu.service';
import { ToolbarMenuService } from '../../shared/services/toolbarMenu.service';

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
  private toolbarMenuService = inject(ToolbarMenuService)

  changeAsideFlag(): void { this.asideService.changeFlag() }
  changeMenuUserFlag(value?: boolean) { this.userMenuService.changeFlag(value) }

  get asideFlag() { return this.asideService.flag }
  get userMenuFlag() { return this.userMenuService.flag }

  get settingsMenu() { return this.toolbarMenuService.settingsMenu }
  get menu() { return this.toolbarMenuService.menu }
}