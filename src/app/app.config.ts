import { ApplicationConfig, ENVIRONMENT_INITIALIZER, Injectable, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { DatePipe, registerLocaleData } from '@angular/common';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';

@Injectable({
  providedIn: 'root'
})
class Initializers {
  init() {
    registerLocaleData(localePt, 'pt-BR');
    registerLocaleData(localePt, 'pt-BR', localePtExtra)
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: DatePipe, useValue: 'pt-BR' },
    { provide: ENVIRONMENT_INITIALIZER, multi: true, useValue: () => inject(Initializers).init() }
  ]
};
