import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const router = inject(Router)

  console.log('authService.isAuth', authService.isAuth)

  if (authService.isAuth) { return true }
  else {
    router.navigateByUrl('/home(login:auth)')
    return false
  }
};
