import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders-form',
  standalone: true,
  imports: [],
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.scss', '../../../styles/resource.scss']
})
export class OrdersFormComponent {

  readonly #route = inject(ActivatedRoute)

  ngOnInit(): void {
    // TODO: Move this into a service
    if (!isNaN(Number(this.command))) {
      console.log('fetching data by id')
      return
    }

    // TODO: if 'new' does not exists on URL, redirect to parent
    console.log('creating a new resource')
  }

  get command() { return this.#route.snapshot.paramMap.get('command') }

}
