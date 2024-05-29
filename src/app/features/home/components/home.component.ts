import { Component, inject } from '@angular/core';
import { AsideComponent } from '../../../core/components/aside.component';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { AsideConditionAnimation } from '../../../shared/animations/asideAnimation';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss', '../../../styles/resource.scss'],
    imports: [AsideComponent, CommonModule],
    animations: [AsideConditionAnimation]
})
export class HomeComponent {

    private asideService = inject(AsideService)
    private route = inject(ActivatedRoute)
    private toolbarMenuService = inject(ToolbarMenuService)

    ngOnInit() {
        this.toolbarMenuService.currentMenu = this.route.snapshot.data[environment.MENU]
    }

    get asideFlag() { return this.asideService.flag }
}
