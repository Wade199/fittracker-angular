import { Component, OnInit } from '@angular/core';

/**
 * Bannière de consentement RGPD.
 * Affichée une seule fois au premier accès.
 * Conforme au RGPD (Règlement Général sur la Protection des Données).
 */
@Component({
  selector: 'app-gdpr-banner',
  templateUrl: './gdpr-banner.component.html',
  styleUrls: ['./gdpr-banner.component.css']
})
export class GdprBannerComponent implements OnInit {

  visible = false;
  showDetails = false;

  private readonly CONSENT_KEY = 'gdpr_consent';

  ngOnInit(): void {
    // Affiche la bannière seulement si pas encore accepté
    const consent = localStorage.getItem(this.CONSENT_KEY);
    if (!consent) {
      this.visible = true;
    }
  }

  acceptAll(): void {
    localStorage.setItem(this.CONSENT_KEY, JSON.stringify({
      accepted: true,
      date: new Date().toISOString(),
      version: '1.0'
    }));
    this.visible = false;
  }

  acceptEssential(): void {
    localStorage.setItem(this.CONSENT_KEY, JSON.stringify({
      accepted: 'essential',
      date: new Date().toISOString(),
      version: '1.0'
    }));
    this.visible = false;
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
