import { Component } from '@angular/core';
import { AsideComponent } from '../../../core/components/aside.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [AsideComponent]
})
export class HomeComponent {

}
