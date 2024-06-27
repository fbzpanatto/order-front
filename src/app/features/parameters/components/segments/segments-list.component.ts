import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsideService, paths } from '../../../../shared/services/aside.service';
import { FetchFieldService } from '../../../../shared/services/fetchField.service';
import { ToolbarMenuService } from '../../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../../environments/environment';
import { SuccessGET } from '../../../../shared/interfaces/response/response';
import { FetchSegmentsService } from '../../../../shared/services/fetch-segments.service';

interface Segment { company_id: number, segment_id: number, name: string, corporate_name: string, created_at: string, updated_at: string }

@Component({
  selector: 'app-segments',
  standalone: true,
  imports: [],
  templateUrl: './segments-list.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/table.scss']
})
export class SegmentsListComponent {

  #segments?: Segment[]

  #route = inject(ActivatedRoute)
  #http = inject(FetchSegmentsService)
  #asideService = inject(AsideService)
  #toolbarMenuService = inject(ToolbarMenuService)
  #router = inject(Router)

  async ngOnInit() {
    this.asideFilters()
    this.menuSettings()

    await this.getAll()
  }

  async getAll() { this.segments = ((await this.#http.getAll({}) as SuccessGET).data) as Segment[] }

  asideFilters() { this.#asideService.getResourceFilters(this.path) }

  navigateTo(queryParams: { [key: string]: any }) {
    this.#router.navigate(['/parameters/segments/form'], { queryParams })
  }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }

  get segments() { return this.#segments }
  set segments(value: Segment[] | undefined) { this.#segments = value }

  get path() { return this.#route.snapshot.parent?.routeConfig?.path as paths }
}
