import { Injectable } from '@angular/core';

interface Menu { id: number, routerLink: string, iClass: string, title: string }

@Injectable({
  providedIn: 'root'
})
export class ToolbarMenuService {

  get settingsMenu() {
    return [
      {
        id: 1,
        routerLink: 'user',
        iClass: 'fa-solid fa-user-pen',
        title: 'Editar usuário'
      },
      {
        id: 2,
        routerLink: 'parameters',
        iClass: 'fa-solid fa-screwdriver-wrench',
        title: 'Parâmetros'
      },
    ]
  }

  get defaultMenu(): Menu[] {
    return [
      {
        id: 1,
        routerLink: 'home',
        iClass: 'fa-solid fa-house',
        title: 'Home'
      },
      {
        id: 2,
        routerLink: 'customers',
        iClass: 'fa-solid fa-user-group',
        title: 'Clientes'
      },
      {
        id: 3,
        routerLink: 'orders',
        iClass: 'fa-solid fa-list',
        title: 'Pedidos'
      },
      {
        id: 4,
        routerLink: 'products',
        iClass: 'fa-solid fa-box',
        title: 'Produtos'
      }
    ]
  }
}