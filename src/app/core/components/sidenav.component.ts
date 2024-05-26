import { Component } from '@angular/core';
import { ToolbarComponent } from "./toolbar.component";
import { AsideComponent } from "./aside.component";

@Component({
    selector: 'app-sidenav',
    standalone: true,
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    imports: [ToolbarComponent, AsideComponent]
})
export class SidenavComponent {
}
