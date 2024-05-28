import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsideService {

  #flag = signal(true);

  readonly flag = this.#flag.asReadonly();

  changeFlag() { this.#flag.update(val => !val) }
}