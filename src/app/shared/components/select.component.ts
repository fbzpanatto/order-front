import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ClickOutsideDirective } from '../directives/clickOutside.directive';
import { UserMenuAnimation } from '../animations/userMenuAnimation';
import { AsideService } from '../services/aside.service';

export interface Option { id: number, label: string, value: any, create?: boolean }

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  animations: [UserMenuAnimation],
})
export class SelectComponent {

  emitCurrentOption = output<Option>()

  disabled = input<boolean>(false)
  currOption = input<Option | undefined>(undefined)
  options = input<Option[]>([])
  isCustomer = input<boolean>(false)
  label = input<string | undefined>('')
  placeholder = input<string | undefined>('')

  #state = signal<boolean | undefined>(false)
  #currentOption = signal<Option | undefined>(undefined)
  #asideService = inject(AsideService)

  constructor() {
    effect(() => {
      const option = this.currOption()
      if (option != undefined) { this.setOption(option as Option) }
    }, { allowSignalWrites: true })
  }

  ngOnInit(): void {
    if (this.isCustomer()) {
      const option = this.options()?.find(option => option.value === this.customerType)
      this.#currentOption.update(currentOption => currentOption = option)
    }
  }

  openOrClose(state?: boolean) { this.#state.update(value => state != undefined ? value = state : value = !value) }

  setOption(option: Option) {

    this.#currentOption.update(currentOption => {

      if (this.isCustomer()) { this.#asideService.changeCustomerType(option.value) }

      this.emitCurrentOption.emit(option)

      return currentOption = option
    })
  }

  get customerType() { return this.#asideService.customerType() }
  get currentState() { return this.#state.asReadonly() }
  get currentOption() { return this.#currentOption.asReadonly() }
}
