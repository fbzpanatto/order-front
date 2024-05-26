import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders-form',
  standalone: true,
  imports: [],
  templateUrl: './orders-form.component.html',
  styleUrl: './orders-form.component.scss'
})
export class OrdersFormComponent {

  readonly #route = inject(ActivatedRoute)

  ngOnInit(): void {
    console.log('orderId', this.orderId)
  }

  get orderId() { return this.#route.snapshot.paramMap.get('command') }

}
