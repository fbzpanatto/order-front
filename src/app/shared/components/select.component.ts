import { Component, input, signal } from '@angular/core';
import { ClickOutsideDirective } from '../directives/clickOutside.directive';
import { UserMenuAnimation } from '../animations/userMenuAnimation';

interface Option { id: number, label: string, value: string, disabled?: boolean }

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  animations: [UserMenuAnimation],
})
export class SelectComponent {

  options = input<Option[] | undefined>([])

  #state = signal<boolean | undefined>(false)
  #currentOption = signal<Option | undefined>(undefined)

  changeState(state?: boolean) {
    this.#state.update(value => state != undefined ? value = state : value = !value)
  }

  setOption(option: Option) {
    this.#currentOption.update(currentOption => currentOption = option)
  }

  get currentState() { return this.#state.asReadonly() }
  get currentOption() { return this.#currentOption.asReadonly() }
}
