import { Injectable } from '@angular/core';

interface Menu { id: number, routerLink: string, iClass: string, title: string, toolbar: boolean }

@Injectable({
  providedIn: 'root'
})
export class ToolbarMenuService {

  #menuName = 'default'

  get menuArray() {
    return this.menuName === 'default' ?
      this.defaultMenu :
      this.settingsMenu
  }

  get menuName() { return this.#menuName }
  set menuName(param: string) { this.#menuName = param }

  get settingsMenu(): Menu[] {
    return [
      {
        id: 1,
        routerLink: 'user',
        iClass: 'fa-solid fa-user-pen',
        title: 'Editar usuário',
        toolbar: true
      },
      {
        id: 2,
        routerLink: 'parameters',
        iClass: 'fa-solid fa-screwdriver-wrench',
        title: 'Parâmetros',
        toolbar: true
      },
      {
        id: 3,
        routerLink: 'login',
        iClass: 'fa-solid fa-right-from-bracket',
        title: 'Sair',
        toolbar: false
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
        toolbar: true
      },
      {
        id: 2,
        routerLink: 'customers',
        iClass: 'fa-solid fa-user-group',
        title: 'Clientes',
        toolbar: true
      },
      {
        id: 3,
        routerLink: 'orders',
        iClass: 'fa-solid fa-list',
        title: 'Pedidos',
        toolbar: true
      },
      {
        id: 4,
        routerLink: 'products',
        iClass: 'fa-solid fa-box',
        title: 'Produtos',
        toolbar: true
      },
      {
        id: 5,
        routerLink: 'login',
        iClass: 'fa-solid fa-right-from-bracket',
        title: 'Sair',
        toolbar: false
      },
    ]
  }
}