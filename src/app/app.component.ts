import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './core/components/sidenav.component';
import { LoginComponent } from "./features/login/components/login.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, SidenavComponent, RouterLink, LoginComponent]
})
export class AppComponent {
  title = 'front';
}
