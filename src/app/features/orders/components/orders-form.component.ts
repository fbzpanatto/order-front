import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-orders-form',
  standalone: true,
  imports: [],
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.scss', '../../../styles/resource.scss']
})
export class OrdersFormComponent {

  readonly #route = inject(ActivatedRoute)
  #toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit(): void {

    this.menuSettings()

    if (!isNaN(Number(this.command))) {
      console.log('fetching data by id')
      return
    }

    // TODO: if 'new' does not exists on URL, redirect to parent
    console.log('creating a new resource')
  }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]
    this.#toolbarMenuService.hasFilter = false
  }

  get command() { return this.#route.snapshot.paramMap.get('command') }

}
