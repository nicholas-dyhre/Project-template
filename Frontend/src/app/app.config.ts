import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { API_BASE_URL, ApiClient } from './api/generated-api-client';

import { routes } from './app.routes';
import { AuthInterceptor } from '../services/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Enable DI interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // Register interceptor in DI
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // NSwag
    { provide: API_BASE_URL, useValue: 'http://localhost:5233' },
    ApiClient
  ]
};