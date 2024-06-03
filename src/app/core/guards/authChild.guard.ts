import { inject } from '@angular/core';
import { Router, type CanActivateChildFn } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export const authChildGuard: CanActivateChildFn = (childRoute, state) => {

  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuth) { return true }
  else {
    router.navigateByUrl('/home(login:auth)')
    return false
  }
};
