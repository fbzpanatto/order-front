import { Component, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { paths } from '../../../shared/services/aside.service';

interface Company { id: number, company_name: string, cnpj: string }

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss', '../../../styles/resource.scss']
})
export class CompaniesListComponent {

  #companiesArray?: Company[]
  #route = inject(ActivatedRoute)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit() {
    this.asideFilters()
    this.menuSettings()
  }

  asideFilters() { this.#asideService.getResourceFilters(this.path) }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get companiesArray() { return this.#companiesArray }
  set companiesArray(value: Company[] | undefined) { this.#companiesArray = value }

  get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }

}
