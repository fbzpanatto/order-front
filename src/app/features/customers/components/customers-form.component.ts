import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { environment } from '../../../../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerTypeService } from '../../../shared/services/customerType.service';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss', '../../../styles/resource.scss']
})
export class CustomersFormComponent {

  #router = inject(Router)
  #route = inject(ActivatedRoute)
  #toolbarMenuService = inject(ToolbarMenuService)
  #customerTypeService = inject(CustomerTypeService)

  ngOnInit(): void {

    this.canProced()
    this.menuSettings()

    if (!isNaN(Number(this.command))) {
      console.log('fetching data by id')
      return
    }

    // TODO: if 'new' does not exists on URL, redirect to parent
    console.log('creating a new resource')
  }

  canProced() {
    return !((this.customerType && this.customerType === 'normal') || (this.customerType && this.customerType === 'legal')) ?
      this.#router.navigate([''], { relativeTo: this.#route }) :
      this.setCustomerType()
  }

  setCustomerType() { this.#customerTypeService.customerType = this.customerType as string }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.#route.snapshot.data[environment.MENU]
    this.#toolbarMenuService.hasFilter = false
  }

  get command() { return this.#route.snapshot.paramMap.get('command') }
  get customerType() { return this.#route.snapshot.paramMap.get('type') }
}
