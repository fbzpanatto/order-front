import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, firstValueFrom, of }  from "rxjs";
import { ApiError } from "../interfaces/response/response";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FetchProductionStatusService {

  #http = inject(HttpClient)

  async getStatus(queryParams: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.get(this.fullResource + `?${this.createQueryString(queryParams)}`)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async saveData(body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.post(this.fullResource, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  async updateData(queryParams: { [key: string]: any }, body: { [key: string]: any }) {
    return await firstValueFrom(
      this.#http.patch(this.fullResource + `?${this.createQueryString(queryParams)}`, body)
        .pipe(catchError((apiError) => this.errorHandler(apiError.error as ApiError))))
  }

  createQueryString(queryParams: { [key: string]: any }): string {
    let params = new HttpParams();
    for (const key in queryParams) { if (queryParams.hasOwnProperty(key)) { params = params.set(key, queryParams[key]) } }
    return params.toString();
  }

  errorHandler(apiError: ApiError) {
    console.log(apiError)
    return of(apiError)
  }

  private get fullResource() { return environment.API_URL + environment.PRODUCTSTATUS }
}
