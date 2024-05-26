import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [],
  templateUrl: './customers-form.component.html',
  styleUrl: './customers-form.component.scss'
})
export class CustomersFormComponent {

  readonly #route = inject(ActivatedRoute)

  ngOnInit(): void {
    if (!isNaN(Number(this.command))) {
      console.log('fetching data by id')
      return
    }

    console.log('creating a new resource')
  }

  get command() { return this.#route.snapshot.paramMap.get('command') }
}
