import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface Menu {
  id: number,
  routerLink?: string,
  iClass: string,
  title: string,
  toolbar: boolean,
  userMenu: boolean,
  authAction?: boolean,
  isLogin?: boolean,
  isLogout?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ToolbarMenuService {

  #menuName = environment.DEFAULT
  #hasFilter: boolean | undefined
  #filterState: boolean | undefined = true

  get filterState() { return this.#filterState }
  set filterState(state: boolean | undefined) { this.#filterState = state }

  get hasFilter() { return this.#hasFilter }
  set hasFilter(condition: boolean | undefined) { this.#hasFilter = condition }

  get menuName() { return this.#menuName }
  set menuName(param: string) { this.#menuName = param }

  get menuArray() {
    return this.menuName === environment.DEFAULT ?
      this.defaultMenu :
      this.settingsMenu
  }

  get settingsMenu(): Menu[] {
    return [
      {
        id: 1,
        routerLink: 'users',
        iClass: 'fa-solid fa-user-pen',
        title: 'Usuários',
        toolbar: true,
        userMenu: true
      },
      {
        id: 2,
        routerLink: 'parameters',
        iClass: 'fa-solid fa-screwdriver-wrench',
        title: 'Parâmetros',
        toolbar: true,
        userMenu: true
      },
      {
        id: 3,
        routerLink: 'home',
        iClass: 'fa-solid fa-house',
        title: 'Voltar ao Sistema',
        toolbar: true,
        userMenu: false
      },
      {
        id: 4,
        iClass: 'fa-solid fa-right-from-bracket',
        title: 'Sair',
        toolbar: false,
        userMenu: true,
        authAction: true,
        isLogout: true
      },
      {
        id: 5,
        iClass: 'fa-solid fa-right-to-bracket',
        title: 'Entrar',
        toolbar: false,
        userMenu: true,
        authAction: true,
        isLogin: true
      },
    ]
  }

  get defaultMenu(): Menu[] {
    return [
      {
        id: 1,
        routerLink: 'home',
        iClass: 'fa-solid fa-house',
        title: 'Home',
        toolbar: true,
        userMenu: true
      },
      {
        id: 2,
        routerLink: 'customers',
        iClass: 'fa-solid fa-user-group',
        title: 'Clientes',
        toolbar: true,
        userMenu: true
      },
      {
        id: 3,
        routerLink: 'orders',
        iClass: 'fa-solid fa-list',
        title: 'Pedidos',
        toolbar: true,
        userMenu: true
      },
      {
        id: 4,
        routerLink: 'products',
        iClass: 'fa-solid fa-box',
        title: 'Produtos',
        toolbar: true,
        userMenu: true
      },
      {
        id: 5,
        iClass: 'fa-solid fa-right-from-bracket',
        title: 'Sair',
        toolbar: false,
        userMenu: true,
        authAction: true,
        isLogout: true
      },
      {
        id: 6,
        iClass: 'fa-solid fa-right-to-bracket',
        title: 'Entrar',
        toolbar: false,
        userMenu: true,
        authAction: true,
        isLogin: true
      },
    ]
  }
}