import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss', '../../../styles/resource.scss']
})
export class CustomersFormComponent {

  #route = inject(ActivatedRoute)
  #router = inject(Router)
  #toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit(): void {

    if (!((this.type && this.type === 'normal') || (this.type && this.type === 'legal'))) {
      this.#router.navigate([''], { relativeTo: this.#route })
    }

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

  get type() { return this.#route.snapshot.paramMap.get('type') }
  get command() { return this.#route.snapshot.paramMap.get('command') }
}
