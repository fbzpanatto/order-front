import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AsideService, paths } from '../../../../shared/services/aside.service';
import { ToolbarMenuService } from '../../../../shared/services/toolbarMenu.service';
import { FetchFieldService } from '../../../../shared/services/fetchField.service';
import { environment } from '../../../../../environments/environment';
import { SuccessGET } from '../../../../shared/interfaces/response/response';

interface Field { id: number, table: string, field: string, label: string }

@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fields-list.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/form.scss', '../../../../styles/table.scss'],
})
export class FieldsListComponent {

  #fields?: Field[]

  #route = inject(ActivatedRoute)
  #http = inject(FetchFieldService)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)

  async ngOnInit() {
    this.asideFilters()
    this.menuSettings()

    await this.getAll()
  }

  async getAll() { this.fields = ((await this.#http.getAll() as SuccessGET).data) as Field[] }

  asideFilters() { this.#asideService.getResourceFilters(this.path) }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get fields() { return this.#fields }
  set fields(value: Field[] | undefined) { this.#fields = value }

  get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }
}
