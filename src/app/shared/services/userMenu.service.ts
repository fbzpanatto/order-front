import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserMenuService {

  #flag = signal(false);

  readonly flag = this.#flag.asReadonly();

  changeFlag(newValue?: boolean) {

    newValue != undefined ?
      this.#flag.update(val => val = newValue) :
      this.#flag.update(val => !val)
  }
}
