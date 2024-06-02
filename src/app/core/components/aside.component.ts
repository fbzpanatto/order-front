import { Component, inject } from '@angular/core';
import { AsideFiltersService } from '../../shared/services/asideFilters.service';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {

  #asideFiltersService = inject(AsideFiltersService)

  ngOnInit(): void {
    console.log('AsideComponent', this.#asideFiltersService.path)
  }
}
