import { Injectable } from '@angular/core';

export type paths = 'customers' | 'products' | 'orders'

interface FormFields {
  id: string,
  name: string,
  type: 'text' | 'select',
  placeholder?: string,
  options?: {
    id: number,
    value: number | string
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class AsideFiltersService {

  #path?: paths

  formFilter(path: paths) { return this.filters[path] }

  get path() { return this.#path }
  set path(value: paths | undefined) { this.#path = value }

  private get filters(): { [key: string]: FormFields[] } { return { customers: this.customerFilterForm } }
  private get customerFilterForm(): FormFields[] {
    return [
      {
        id: 'customerType',
        name: 'customerType',
        type: 'select',
        options: [
          {
            id: 1,
            value: 'Tipo cliente'
          },
          {
            id: 2,
            value: 'Jurídico'
          },
          {
            id: 3,
            value: 'Físico'
          }
        ]
      },
      {
        id: 'search',
        name: 'search',
        type: 'text',
        placeholder: 'search'
      },
    ]
  }
}
