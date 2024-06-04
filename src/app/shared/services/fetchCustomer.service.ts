import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, takeUntil, map, catchError, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchCustomerService {

  private http = inject(HttpClient)
  private router = inject(Router)

  async getAll() {
    const observable = await firstValueFrom(this.http.get(environment.API_URL + this.resource))
    return observable
  }

  async saveData(body: any) {
    const observable = await firstValueFrom(this.http.post(environment.API_URL + this.resource, body))
    return observable
  }

  get resource() { return environment.CUSTOMERS }

}
