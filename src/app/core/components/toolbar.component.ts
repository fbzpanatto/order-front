import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsideService } from '../../shared/services/aside.service';
import { BackButtonDirective } from '../../shared/directives/backButton.directive';
import { UserMenuService } from '../../shared/services/userMenu.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BackButtonDirective],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  private asideService = inject(AsideService)
  private userMenuService = inject(UserMenuService)

  changeAsideFlag() { this.asideService.changeFlag() }
  changeUserMenuFlag() { this.userMenuService.changeFlag() }

  get userMenuFlag() { return this.userMenuService.flag }
  get asideFlag() { return this.asideService.flag }
}
