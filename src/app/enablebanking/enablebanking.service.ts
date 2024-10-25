import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import {AuthorizeSessionResponse, GetSessionResponse, StartAuthorizationResponse} from '../models';


export const APPLICATION_ID = new InjectionToken<string>("applicationId");
export const REDIRECT_URL = new InjectionToken<string>("redirectUrl");

@Injectable({
  providedIn: 'root',
})
export class EnablebankingService {

  http = inject(HttpClient);

  applicationId: string = inject(APPLICATION_ID);
  redirectUrl: string = inject(REDIRECT_URL);

  // TODO: support deep-linking
  //  -> add "redirectRoute" (string) param
  //  -> route: where to route after auth-flow is finished
  //  -> store route
  startUserAuth(expireDays: number = 10) {
    const hardcodedBank = {
      name: 'VR Bank Bamberg-Forchheim',
      country: 'DE'
    }

    const dayInMillis = 24 * 60 * 60 * 1000;
    const validUntil = new Date(new Date().getTime() + dayInMillis * expireDays);

    const startAuthorizationBody = {
      access: {
        valid_until: validUntil.toISOString()
      },
      aspsp: { ...hardcodedBank },
      state: this.applicationId,
      redirect_url: this.redirectUrl,
      psu_type: "personal",
    }

    return this.http.post<StartAuthorizationResponse>('/enablebanking/auth', startAuthorizationBody);
  }

  /**
   * Creates a new user session.
   * @param {string} code Code added as query parameter during redirection of user authentication
   */
  createSession(code: string) {
    return this.http.post<AuthorizeSessionResponse>(`enablebanking/sessions`, { code });
  }

  getSessionData(sessionId: string) {
    return this.http.get<GetSessionResponse>(`enablebanking/sessions/${sessionId}`);
  }
}
