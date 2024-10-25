import {Component, effect, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EnablebankingService} from '../../enablebanking/enablebanking.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {map, take} from 'rxjs';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.css'
})
export class RedirectComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  bankingService = inject(EnablebankingService);

  authCode = toSignal(this.activatedRoute.queryParamMap.pipe(
    map(paramMap => paramMap.get('code') ?? undefined))
  );
  #onAuthCodeChanges = effect(() => {
    const code = this.authCode();
    if (code === undefined) return;

    this.bankingService.createSession(code)
      .pipe(take(1))
      .subscribe(async session => {
        sessionStorage.setItem('enablebanking_session_id', session.session_id);
        await this.router.navigate(['/']);
      });
  });
}
