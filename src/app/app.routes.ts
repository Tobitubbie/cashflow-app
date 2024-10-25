import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {authGuardGuard} from './auth/auth-guard.guard';
import {RedirectComponent} from './auth/redirect/redirect.component';
import {SecureComponent} from './secure/secure.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'redirect',
    component: RedirectComponent,
  },
  {
    path: 'secure',
    canActivate: [authGuardGuard],
    component: SecureComponent,
  }
];
