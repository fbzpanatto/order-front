import { Component, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss', '../../../styles/resource.scss'],
    imports: [CommonModule]
})
export class HomeComponent {

    #route = inject(ActivatedRoute)
    #asideService = inject(AsideService)
    #toolbarMenuService = inject(ToolbarMenuService)

    ngOnInit() {
        this.menuSettings()
    }

    menuSettings() {
        this.#toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]
        this.#toolbarMenuService.hasFilter = true
    }

    get asideFlag() { return this.#asideService.flag }
}
