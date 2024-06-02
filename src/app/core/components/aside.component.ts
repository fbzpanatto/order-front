import { Component, effect, inject } from '@angular/core';
import { AsideService } from '../../shared/services/aside.service';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {

  #asideService = inject(AsideService)

  constructor() {
    effect(() => {[
      console.log(this.#asideService.formFilterSignal())
    ]})
  }

  ngOnInit(): void {
  }
}
