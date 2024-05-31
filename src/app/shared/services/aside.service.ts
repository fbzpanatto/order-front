import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsideService {

  #flag = signal(true);

  readonly flag = this.#flag.asReadonly();

  changeFlag(state?: boolean) { this.#flag.update(val => state != undefined ? state : !val) }
}
