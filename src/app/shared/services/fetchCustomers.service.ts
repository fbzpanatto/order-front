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
      this.#http.get(this.fullResource)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async getById(personId: number | string) {
    return await firstValueFrom(
      this.#http.get(this.fullResource + '/' + personId)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async saveData(body: any) {
    return await firstValueFrom(
      this.#http.post(this.fullResource, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async updateData(personId: number, body: any) {
    return await firstValueFrom(
      this.#http.patch(this.fullResource + '/' + personId, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async deleteContact(personId: number, contactId: number) {
    return await firstValueFrom(
      this.#http.delete(this.fullResource + '/' + personId + '/' + `contact/${contactId}`)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  errorHandler(apiError: ApiError) {
    // TODO: open a dialog with error message
    return of(apiError)
  }

  private get fullResource() { return environment.API_URL + environment.CUSTOMERS + '/' + this.customerType }
  private get customerType() { return this.#asideService.customerType() }

}