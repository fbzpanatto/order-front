import { Injectable, inject } from '@angular/core';
import { firstValueFrom, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiError } from '../interfaces/response/response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FetchRolesService {

  #http = inject(HttpClient)

  async getAll() {
    return await firstValueFrom(
      this.#http.get(this.fullResource)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async getById(roleId: number | string) {
    return await firstValueFrom(
      this.#http.get(this.fullResource + '/' + roleId)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async saveData(body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.post(this.fullResource, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async updateData(roleId: number, body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.patch(this.fullResource + '/' + roleId, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  errorHandler(apiError: ApiError) {
    // TODO: open a dialog with error message
    return of(apiError)
  }

  private get fullResource() { return environment.API_URL + environment.ROLES }

}
