import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AsideService } from './aside.service';
import { ApiError } from '../interfaces/response/response';

@Injectable({
  providedIn: 'root'
})
export class FetchCustomerService {

  #http = inject(HttpClient)
  #asideService = inject(AsideService)

  async getAll() {
    return await firstValueFrom(
      this.#http.get(environment.API_URL + this.fullResource)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async getById(personId: number | string) {
    return await firstValueFrom(
      this.#http.get(environment.API_URL + this.fullResource + '/' + personId)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async saveData(body: any) {
    return await firstValueFrom(
      this.#http.post(environment.API_URL + this.fullResource, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async updateData(personId: number, body: any) {
    return await firstValueFrom(
      this.#http.patch(environment.API_URL + this.fullResource + '/' + personId, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  errorHandler(apiError: ApiError) {
    // TODO: open a dialog with error message
    return of(apiError)
  }

  private get fullResource() { return environment.CUSTOMERS + '/' + this.customerType }
  private get customerType() { return this.#asideService.customerType() }

}
