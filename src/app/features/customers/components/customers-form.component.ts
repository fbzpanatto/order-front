import { Component, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [],
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss', '../../../styles/resource.scss']
})
export class CustomersFormComponent {

  readonly #route = inject(ActivatedRoute)
  private toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit(): void {

    this.toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]

    if (!isNaN(Number(this.command))) {
      console.log('fetching data by id')
      return
    }

    // TODO: if 'new' does not exists on URL, redirect to parent
    console.log('creating a new resource')
  }

  get command() { return this.#route.snapshot.paramMap.get('command') }
}
