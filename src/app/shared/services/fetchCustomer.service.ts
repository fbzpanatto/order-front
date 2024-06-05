import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AsideService } from './aside.service';
import { SuccessGET } from '../interfaces/response/response';

@Injectable({
  providedIn: 'root'
})
export class FetchCustomerService {

  #http = inject(HttpClient)
  #asideService = inject(AsideService)

  async getAll() {
    const response = await firstValueFrom(this.#http.get(environment.API_URL + this.fullResource))
    // TODO: check possibility of errors on response
    return response as SuccessGET
  }

  async getById(personId: number | string) {
    const response = await firstValueFrom(this.#http.get(environment.API_URL + this.fullResource + '/' + personId))
    return response
  }

  async saveData(body: any) { return await firstValueFrom(this.#http.post(environment.API_URL + this.fullResource, body)) }

  private get fullResource() { return environment.CUSTOMERS + '/' + this.customerType }
  private get customerType() { return this.#asideService.customerType() }

}
