import { Component, OnInit, inject } from '@angular/core';
import { ToolbarComponent } from "./toolbar.component";
import { AsideComponent } from "./aside.component";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    imports: [ToolbarComponent, AsideComponent]
})
export class SidenavComponent implements OnInit {

    readonly #route = inject(ActivatedRoute)

    ngOnInit(): void {

        console.log(this.#route)

    }
}
