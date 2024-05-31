import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsideService } from '../../shared/services/aside.service';
import { BackButtonDirective } from '../../shared/directives/backButton.directive';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';
import { UserMenuAnimation } from '../../shared/animations/userMenuAnimation';
import { UserMenuService } from '../../shared/services/userMenu.service';
import { ToolbarMenuService } from '../../shared/services/toolbarMenu.service';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BackButtonDirective, ClickOutsideDirective],
  animations: [UserMenuAnimation],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  private router = inject(Router)
  private authService = inject(AuthService)
  private asideService = inject(AsideService)
  private userMenuService = inject(UserMenuService)
  private toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(_ => this.userMenuService.changeFlag(false))
  }

  login() { this.authService.redirectToLoginPage() }
  logout() { this.authService.logout() }

  changeAsideFlag(): void { this.asideService.changeFlag() }
  changeMenuUserFlag(value?: boolean) { this.userMenuService.changeFlag(value) }

  get isAuth() { return this.authService.isAuth }

  get asideFlag() { return this.asideService.flag }
  get userMenuFlag() { return this.userMenuService.flag }

  get menu() { return this.menuName === this.default ? this.settingsMenu : this.defaultMenu }
  get settingsMenu() { return this.toolbarMenuService.settingsMenu }
  get defaultMenu() { return this.toolbarMenuService.defaultMenu }

  get menuArray() { return this.toolbarMenuService.menuArray }
  get menuName() { return this.toolbarMenuService.menuName }

  get default() { return environment.DEFAULT }

  get filterState() { return this.toolbarMenuService.filterState }
}