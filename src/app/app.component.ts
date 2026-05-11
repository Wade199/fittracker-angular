import { Component } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /** Contrôle l'affichage du splash screen */
  showSplash = true;

  constructor(public authService: AuthService) {}

  onSplashDone(): void {
    this.showSplash = false;
  }
}
