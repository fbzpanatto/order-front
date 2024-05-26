import { Component } from '@angular/core';
import { ToolbarComponent } from "./toolbar.component";

@Component({
    selector: 'app-sidenav',
    standalone: true,
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    imports: [ToolbarComponent]
})
export class SidenavComponent {
}
