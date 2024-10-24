import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { APPLICATION_ID, REDIRECT_URL } from './enablebanking/enablebanking.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([]),
    ),
    {
      provide: APPLICATION_ID,
      useValue: 'aaaa-bbbbbb-cccccc-dddd',
    },
    {
      provide: REDIRECT_URL,
      useValue: 'http://localhost:4000/auth',
    },
  ]
};
