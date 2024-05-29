import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsideService } from '../../shared/services/aside.service';
import { BackButtonDirective } from '../../shared/directives/backButton.directive';
import { ClickOutsideDirective } from '../../shared/directives/clickOutside.directive';
import { UserMenuAnimation } from '../../shared/animations/userMenuAnimation';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BackButtonDirective, ClickOutsideDirective],
  animations: [UserMenuAnimation],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  isOpen = false;

  private asideService = inject(AsideService)

  changeAsideFlag() { this.asideService.changeFlag() }

  changeMenuUserFlag() { this.isOpen = !this.isOpen }

  get asideFlag() { return this.asideService.flag }
}
