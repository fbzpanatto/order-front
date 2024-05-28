import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserMenuService {

  #flag = signal(false);

  readonly flag = this.#flag.asReadonly();

  changeFlag() { this.#flag.update(val => !val) }
}
