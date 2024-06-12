import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [],
  templateUrl: './products-form.component.html',
  styleUrls: ['../../../styles/resource.scss', '../../../styles/form.scss', '../../../styles/title-bar.scss'],
})
export class ProductsFormComponent {

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
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get command() { return this.#route.snapshot.paramMap.get('command') }

}
