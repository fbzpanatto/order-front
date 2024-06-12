import { Component, effect, inject } from '@angular/core';
import { AsideService } from '../../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { paths } from '../../../shared/services/aside.service';
import { FetchCompaniesService } from '../../../shared/services/fetchCompanies.service';
import { SuccessGET } from '../../../shared/interfaces/response/response';

interface Company { company_id: number, corporate_name: string, social_name: string, cnpj: string, state_registration: string, active: number | boolean }

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
  #http = inject(FetchCompaniesService)

  async ngOnInit() {
    this.asideFilters()
    this.menuSettings()

    await this.getAll()
  }

  async getAll() { this.companiesArray = ((await this.#http.getAll() as SuccessGET).data) as Company[] }

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
