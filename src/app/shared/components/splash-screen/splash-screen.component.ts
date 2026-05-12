import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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
    // Fade out après 1.8s
    setTimeout(() => { this.fadeOut = true; }, 1800);
    // Disparaît après 2.4s
    setTimeout(() => {
      this.visible = false;
      this.splashDone.emit();
    }, 2400);
  }
}
