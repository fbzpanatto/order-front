import { Component, input, signal } from '@angular/core';
import { ClickOutsideDirective } from '../directives/clickOutside.directive';
import { UserMenuAnimation } from '../animations/userMenuAnimation';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  animations: [UserMenuAnimation],
})
export class SelectComponent {

  options = input<{ id: number, label: string, value: string, disabled?: boolean }[] | undefined>([])

  #flag = signal<boolean | undefined>(false)
  flag = this.#flag.asReadonly()

  changeFlag(state?: boolean) {
    this.#flag.update(value => state != undefined ? value = state : value = !value)
  }
}
