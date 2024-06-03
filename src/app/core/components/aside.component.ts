import { Component, inject } from '@angular/core';
import { AsideService } from '../../shared/services/aside.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {

  #asideService = inject(AsideService)

  onSelect(value: string) { this.#asideService.changeCustomerType(value) }

  get formFields() { return this.#asideService.formFilterSignal() }
}
