import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  test() {
   console.log("test :-)")
  }

  deleteSessionId() {
    sessionStorage.setItem('enablebanking_session_id', '420');
  }
}
