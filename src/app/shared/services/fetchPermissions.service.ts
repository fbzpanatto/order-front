import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiError } from '../interfaces/response/response';

@Injectable({
  providedIn: 'root'
})
export class FetchPermissionsService {

  #http = inject(HttpClient)

  async getAll() {
    return await firstValueFrom(
      this.#http.get(this.fullResource)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async getById(permissionId: number | string) {
    return await firstValueFrom(
      this.#http.get(this.fullResource + '/' + permissionId)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async saveData(body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.post(this.fullResource, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async updateData(permissionId: number, body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.patch(this.fullResource + '/' + permissionId, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  errorHandler(apiError: ApiError) {
    console.log(apiError)
    // TODO: open a dialog with error message
    return of(apiError)
  }

  private get fullResource() { return environment.API_URL + environment.PERMISSIONS }

}
