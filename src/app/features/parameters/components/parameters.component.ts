import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss', '../../../styles/resource.scss'],

})
export class ParametersComponent {

  #route = inject(ActivatedRoute)
  #toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit() {
    this.menuSettings()
  }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }
}
