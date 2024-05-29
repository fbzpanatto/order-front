import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #isAuth = true

  private router = inject(Router)

  logout() {
    this.isAuth = false
    this.router.navigateByUrl('/home(login:auth)')
  }

  login() {
    this.isAuth = true
    this.router.navigate(['/'])
  }

  get isAuth() { return this.#isAuth }
  set isAuth(value: boolean) { this.#isAuth = value }

}