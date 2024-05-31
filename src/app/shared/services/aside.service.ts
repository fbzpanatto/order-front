import { Injectable, inject, signal } from '@angular/core';
import { ToolbarMenuService } from './toolbarMenu.service';

@Injectable({
  providedIn: 'root'
})
export class AsideService {

  #flag = signal(true);
  #toolbarService = inject(ToolbarMenuService)

  readonly flag = this.#flag.asReadonly();

  changeFlag(state?: boolean) {
    this.#flag.update(val => {
      state != undefined ? this.#toolbarService.filterState = state : this.#toolbarService.filterState = state = !val
      return state != undefined ? state : !val
    })
  }
}
