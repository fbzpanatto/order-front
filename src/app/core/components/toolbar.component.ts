import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsideService } from '../../shared/services/aside.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  private asideService = inject(AsideService)

  changeAsideFlag() { this.asideService.changeFlag() }

  get asideFlag() { return this.asideService.flag }
}
