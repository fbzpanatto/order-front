import { Component, input } from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {

  options = input<{ id: number, label: string, value: string, disabled?: boolean }[] | undefined>([])

}
