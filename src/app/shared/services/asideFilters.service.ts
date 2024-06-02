import { Injectable } from '@angular/core';

export type paths = 'home' | 'customers' | 'products' | 'orders'

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

  get formFilter() { return this.path ? this.filters[this.path] : [] }

  get path() { return this.#path }
  set path(value: paths | undefined) { this.#path = value }

  private get filters(): { [key: string]: FormFields[] } {
    return {
      home: this.homeFilterForm,
      customers: this.customerFilterForm
    }
  }
  private get homeFilterForm(): FormFields[] {
    return [
      {
        id: 'search',
        name: 'search',
        type: 'text',
        placeholder: 'search'
      },
    ]
  }
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
