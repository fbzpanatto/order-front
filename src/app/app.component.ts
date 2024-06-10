import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './core/components/sidenav.component';
import { LoginComponent } from "./features/login/components/login.component";
import { AuthService } from './shared/services/auth.service';
import { DialogComponent } from "./shared/components/dialog.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, SidenavComponent, RouterLink, LoginComponent, DialogComponent]
})
export class AppComponent {
  title = 'front';

  showDefaultOutlet = false
  showloginOutlet = true

  private authService = inject(AuthService)

  get isAuth() { return this.authService.isAuth }
}
