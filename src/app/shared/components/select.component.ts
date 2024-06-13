import { Component, inject, input, signal } from '@angular/core';
import { ClickOutsideDirective } from '../directives/clickOutside.directive';
import { UserMenuAnimation } from '../animations/userMenuAnimation';
import { AsideService } from '../services/aside.service';

export interface Option { id: number, label: string, value: string, disabled?: boolean }

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  animations: [UserMenuAnimation],
})
export class SelectComponent {

  options = input<Option[]>([])
  isCustomer = input<boolean>(false)

  #state = signal<boolean | undefined>(false)
  #currentOption = signal<Option | undefined>(undefined)
  #asideService = inject(AsideService)

  ngOnInit(): void {


    if (this.isCustomer()) {
      const option = this.options()?.find(option => option.value === this.customerType)
      this.#currentOption.update(currentOption => currentOption = option)
    }
  }

  changeState(state?: boolean) {
    this.#state.update(value => state != undefined ? value = state : value = !value)
  }

  setOption(option: Option) {
    this.#currentOption.update(currentOption => {

      if (this.isCustomer()) { this.#asideService.changeCustomerType(option.value) }

      return currentOption = option
    })
  }

  get customerType() { return this.#asideService.customerType() }
  get currentState() { return this.#state.asReadonly() }
  get currentOption() { return this.#currentOption.asReadonly() }
}
