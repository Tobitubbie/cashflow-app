import {ActivatedRouteSnapshot, CanActivateFn} from '@angular/router';
import {GetSessionResponse} from '../models';
import {catchError, map, of, switchMap, tap} from 'rxjs';
import {EnablebankingService} from '../enablebanking/enablebanking.service';
import {inject} from '@angular/core';

/**
 * Checks for missing or invalid session in session-storage.
 * Initializes fresh user authentication if necessary.
 */
export const authGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const bankingService = inject(EnablebankingService);

  const sessionId = sessionStorage.getItem('enablebanking_session_id') as string | null; // type-cast due to false type inference
  const redirectRoute = route.url.toString();

  return sessionId === null
    ? initializeUserAuthentication(bankingService, redirectRoute)
    : restoreSession(bankingService, sessionId, redirectRoute);
};

function initializeUserAuthentication(bankingService: EnablebankingService, redirectRoute: string) {
  return bankingService.startUserAuth().pipe(
    tap(userAuth => {
      sessionStorage.setItem("local_redirect_route", redirectRoute);
      window.open(userAuth.url, "_self");
    }),
    map(() => false),
  );
}

function restoreSession(bankingService: EnablebankingService, sessionId: string, redirectRoute: string) {
  const isSessionValid = (session: GetSessionResponse): boolean => session.status === 'AUTHORIZED';

  return bankingService.getSessionData(sessionId).pipe(
    switchMap(session => {
      if (isSessionValid(session)) return of(true);
      else return initializeUserAuthentication(bankingService, redirectRoute);
    }),
    catchError(() => initializeUserAuthentication(bankingService, redirectRoute)),
  )
}
