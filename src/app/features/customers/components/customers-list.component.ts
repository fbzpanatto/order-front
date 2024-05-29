import { Component, inject } from '@angular/core';
import { AsideComponent } from "../../../core/components/aside.component";
import { AsideService } from '../../../shared/services/aside.service';
import { AsideConditionAnimation } from '../../../shared/animations/asideAnimation';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-customers-list',
    standalone: true,
    templateUrl: './customers-list.component.html',
    styleUrls: ['./customers-list.component.scss', '../../../styles/resource.scss'],
    imports: [AsideComponent, CommonModule],
    animations: [AsideConditionAnimation]
})
export class CustomersListComponent {
    
    private asideService = inject(AsideService)
    private route = inject(ActivatedRoute)

    ngOnInit() {
        console.log('this.route.data', this.route.snapshot.data['teste'])
    }

    get asideFlag() { return this.asideService.flag }
}
