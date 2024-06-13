import { Component, inject } from '@angular/core';
import { AsideService } from '../../shared/services/aside.service';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../../shared/components/select.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, SelectComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {

  #asideService = inject(AsideService)

  onSelect(value: string) { this.#asideService.changeCustomerType(value) }

  get formFields() { return this.#asideService.formFilterSignal() }
  get currCustomerType() { return this.#asideService.customerType() }
}
