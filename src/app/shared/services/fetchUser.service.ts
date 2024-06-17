import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiError } from '../interfaces/response/response';

@Injectable({
  providedIn: 'root'
})
export class FetchUserService {

  #http = inject(HttpClient)

  async getAll() {
    return await firstValueFrom(
      this.#http.get(this.fullResource)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async getById(userId: number | string) {
    return await firstValueFrom(
      this.#http.get(this.fullResource + '/' + userId)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async saveData(body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.post(this.fullResource, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async updateData(userId: number, body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.patch(this.fullResource + '/' + userId, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  errorHandler(apiError: ApiError) {
    // TODO: open a dialog with error message
    return of(apiError)
  }

  private get fullResource() { return environment.API_URL + environment.USERS }

}
