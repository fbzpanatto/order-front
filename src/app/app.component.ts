import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './core/components/sidenav.component';
import { LoginComponent } from "./features/login/components/login.component";
import { AuthService } from './shared/services/auth.service';
import { DialogComponent } from "./shared/components/dialog.component";
import { DialogService } from './shared/services/dialog.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, SidenavComponent, RouterLink, LoginComponent, DialogComponent]
})
export class AppComponent {
  title = 'front';

  #authService = inject(AuthService)

  showDefaultOutlet = false
  showloginOutlet = true

  #dialogService = inject(DialogService)

  get showDialog() { return this.#dialogService.showDialog }
  get isAuth() { return this.#authService.isAuth }
}
