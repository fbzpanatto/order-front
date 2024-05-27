import { Component, inject } from '@angular/core';
import { AsideComponent } from '../../../core/components/aside.component';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { AsideConditionAnimation } from '../../../shared/animations/asideAnimation';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [AsideComponent, CommonModule],
    animations: [AsideConditionAnimation]
})
export class HomeComponent {

    private asideService = inject(AsideService)

    get asideFlag() { return this.asideService.flag }
}
