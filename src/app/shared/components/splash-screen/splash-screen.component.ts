import { Component, OnInit, Output, EventEmitter } from '@angular/core';

/**
 * Splash screen affiché au démarrage de l'application.
 * Disparaît automatiquement après 2.5 secondes avec une animation de fondu.
 */
@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit {

  @Output() splashDone = new EventEmitter<void>();

  visible = true;
  fadeOut = false;

  ngOnInit(): void {
    // Après 2s → déclenche le fade out
    setTimeout(() => {
      this.fadeOut = true;
    }, 2000);

    // Après 2.8s → cache complètement et notifie le parent
    setTimeout(() => {
      this.visible = false;
      this.splashDone.emit();
    }, 2800);
  }
}
