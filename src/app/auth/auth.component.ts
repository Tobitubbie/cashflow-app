import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { EnablebankingService } from '../enablebanking/enablebanking.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  activatedRoute = inject(ActivatedRoute);
  bankingService = inject(EnablebankingService);
  authCode = toSignal(this.activatedRoute.queryParamMap.pipe(
    map(paramMap => paramMap.get('code') ?? undefined))
  );

  onAuthToken = effect(() => {
    const code = this.authCode();
    if (code !== undefined) {
      this.bankingService.createSession(code).subscribe(session => {
        console.log("NEW SESSION", session);
      });
    }
  });
}
