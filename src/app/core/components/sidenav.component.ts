import { Component, inject } from '@angular/core';
import { ToolbarComponent } from "./toolbar.component";
import { AsideService } from '../../shared/services/aside.service';
import { AsideComponent } from './aside.component';
import { AsideConditionAnimation } from '../../shared/animations/asideAnimation';
import { CommonModule } from '@angular/common';
import { ToolbarMenuService } from '../../shared/services/toolbarMenu.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    imports: [AsideComponent, CommonModule, ToolbarComponent],
    animations: [AsideConditionAnimation]
})
export class SidenavComponent {

    private asideService = inject(AsideService)
    private toolbarMenuService = inject(ToolbarMenuService)

    get asideFlag() { return this.asideService.flag }
    get menuName() { return this.toolbarMenuService.menuName }
    get condition() {
        console.log('this.menuName', this.menuName)
         return this.menuName === environment.DEFAULT 
        }
}
