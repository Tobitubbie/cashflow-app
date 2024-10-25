import {CanActivateFn} from '@angular/router';
import {GetSessionResponse} from '../models';
import {catchError, map, of, switchMap, tap} from 'rxjs';
import {EnablebankingService} from '../enablebanking/enablebanking.service';
import {inject} from '@angular/core';

/**
 * Checks for missing or invalid session in session-storage.
 * Initializes fresh user authentication if necessary.
 */
export const authGuardGuard: CanActivateFn = () => {
  const bankingService = inject(EnablebankingService);

  const sessionId = sessionStorage.getItem('enablebanking_session_id') as string | null; // type-cast due to false type inference
  // if (sessionId === null) return initializeUserAuthentication();

  return sessionId === null
    ? initializeUserAuthentication(bankingService)
    : restoreSession(bankingService, sessionId);
};

function initializeUserAuthentication(bankingService: EnablebankingService) {
  return bankingService.startUserAuth().pipe(
    tap(userAuth => window.open(userAuth.url, "_self")),
    map(() => true),
  );
}

function restoreSession(bankingService: EnablebankingService, sessionId: string) {
  const isSessionValid = (session: GetSessionResponse): boolean => session.status === 'AUTHORIZED';

  return bankingService.getSessionData(sessionId).pipe(
    switchMap(session => {
      if (isSessionValid(session)) return of(true);
      else return initializeUserAuthentication(bankingService);
    }),
    catchError(err => initializeUserAuthentication(bankingService)),
  )
}
