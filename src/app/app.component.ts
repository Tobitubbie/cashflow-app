import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnablebankingService } from './enablebanking/enablebanking.service';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cashflow-app';
  http = inject(HttpClient);
  bankingService = inject(EnablebankingService);

  test() {
    this.bankingService.startUserAuth().subscribe(userAuth => {
      console.log(userAuth);
      window.location.href = userAuth.url;
    });
  }
}
