import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {

  #customerType: string = 'legal'

  get customerType() { return this.#customerType }
  set customerType(value: string) { this.#customerType = value }
}
