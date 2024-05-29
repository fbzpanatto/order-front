import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './core/components/sidenav.component';
import { LoginComponent } from "./features/login/components/login.component";
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, SidenavComponent, RouterLink, LoginComponent]
})
export class AppComponent {
  title = 'front';

  private authService = inject(AuthService)

  constructor() {

  }

  get isAuth() { return this.authService.isAuth }
}
