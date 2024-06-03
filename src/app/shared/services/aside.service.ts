import { Injectable, inject, signal } from '@angular/core';
import { ToolbarMenuService } from './toolbarMenu.service';

export type paths = 'void' | 'home' | 'customers' | 'products' | 'orders'
type Filters = { [key: string]: FormFields[] }

interface FormFields {
  id: string,
  name: string,
  type: 'text' | 'select',
  placeholder?: string,
  options?: {
    id: number,
    label: string,
    value: string,
    disabled?: boolean
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class AsideService {

  #toolbarService = inject(ToolbarMenuService)

  #flag = signal(true);
  #filterSignal = signal<FormFields[] | undefined>(undefined)
  #customerType = signal<string>('legal')

  readonly flag = this.#flag.asReadonly();
  readonly customerType = this.#customerType.asReadonly();
  readonly formFilterSignal = this.#filterSignal.asReadonly();

  changeFlag(state?: boolean) {
    this.#flag.update(val => {
      state != undefined ? this.#toolbarService.filterState = state : this.#toolbarService.filterState = state = !val
      return state != undefined ? state : !val
    })
  }

  changeCustomerType(value: string) { this.#customerType.update(val => val = value) }

  getResourceFilters(path: paths) { this.#filterSignal.update(val => val = this.filters[path]) }

  private get filters(): Filters {
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
            id: 2,
            label: 'Jurídico',
            value: 'legal'
          },
          {
            id: 3,
            label: 'Físico',
            value: 'normal'
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
