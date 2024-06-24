import { Injectable, inject } from '@angular/core';
import { firstValueFrom, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiError } from '../interfaces/response/response';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FetchCompaniesService {

  #http = inject(HttpClient)

  async getAll(queryParams: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.get(this.fullResource + `?${this.createQueryString(queryParams)}`)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async getById(companyId: number | string) {
    return await firstValueFrom(
      this.#http.get(this.fullResource + '/' + companyId)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async saveData(body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.post(this.fullResource, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async updateData(companyId: number, body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.patch(this.fullResource + '/' + companyId, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  createQueryString(queryParams: { [key: string]: any }): string {
    let params = new HttpParams();
    for (const key in queryParams) { if (queryParams.hasOwnProperty(key)) { params = params.set(key, queryParams[key]) } }
    return params.toString();
  }

  errorHandler(apiError: ApiError) {
    // TODO: open a dialog with error message
    return of(apiError)
  }

  private get fullResource() { return environment.API_URL + environment.COMPANIES }
}
