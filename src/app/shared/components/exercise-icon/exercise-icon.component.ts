import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Composant qui affiche une image ou icône SVG pour chaque exercice.
 *
 * PRIORITÉ :
 * 1. Cherche une image dans /assets/exercises/<slug>.jpg (ou .png / .webp)
 * 2. Si l'image est introuvable (erreur 404), affiche un SVG généré dynamiquement
 *
 * Pour ajouter une vraie image, place-la dans src/assets/exercises/
 * avec le bon nom de fichier (voir getExerciseSlug() ci-dessous).
 */
@Component({
  selector: 'app-exercise-icon',
  template: `
    <img
      *ngIf="!imageError"
      [src]="imageUrl"
      [alt]="exerciseName"
      (error)="onImageError()"
      class="exercise-image"
    />
    <div *ngIf="imageError" [innerHTML]="svgContent" class="svg-fallback"></div>
  `,
  styles: [`
    /* Le host remplit 100% de son conteneur — c'est le parent qui fixe la taille */
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background: #0a0a0a;
      overflow: hidden;
    }

    /* Image couvre tout le host sans déborder */
    .exercise-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
      transition: transform 0.4s ease;
    }

    :host:hover .exercise-image {
      transform: scale(1.04);
    }

    /* SVG fallback centré */
    .svg-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .svg-fallback :ng-deep svg {
      width: 42%;
      height: 42%;
      filter: drop-shadow(0 0 12px rgba(245,197,24,0.3));
      transition: transform 0.3s ease;
    }

    :host:hover .svg-fallback :ng-deep svg {
      transform: scale(1.06);
    }
  `]
})
export class ExerciseIconComponent implements OnInit {
  @Input() exerciseName = '';
  @Input() category = '';
  @Input() size: 'normal' | 'large' = 'normal';

  imageUrl = '';
  imageError = false;
  private _svgFallbackUrl = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const slug = this.getExerciseSlug();
    // Essaie JPG d'abord, puis SVG
    this.imageUrl = `/assets/exercises/${slug}.jpg`;
    this._svgFallbackUrl = `/assets/exercises/${slug}.svg`;
  }

  onImageError(): void {
    // Si JPG échoue, essaie le SVG
    if (!this.imageError && this._svgFallbackUrl && !this.imageUrl.endsWith('.svg')) {
      this.imageUrl = this._svgFallbackUrl;
    } else {
      this.imageError = true;
    }
  }

  /**
   * Convertit le nom de l'exercice en nom de fichier.
   * Exemple : "Diamond Push-ups" → "diamond-pushups"
   *
   * Liste complète des noms attendus dans src/assets/exercises/ :
   *   pushups.jpg, diamond-pushups.jpg, pike-pushups.jpg, handstand-pushups.jpg
   *   dips.jpg, pullups.jpg, chinups.jpg, australian-pullups.jpg, muscle-ups.jpg
   *   squats.jpg, jump-squats.jpg, lunges.jpg, pistol-squats.jpg, calf-raises.jpg
   *   plank.jpg, side-plank.jpg, leg-raises.jpg, crunches.jpg
   *   mountain-climbers.jpg, burpees.jpg, jumping-jacks.jpg, high-knees.jpg
   */
  private getExerciseSlug(): string {
    const name = this.exerciseName.toLowerCase();
    if (name.includes('diamond'))                          return 'diamond-pushups';
    if (name.includes('pike'))                             return 'pike-pushups';
    if (name.includes('handstand'))                        return 'handstand-pushups';
    if (name.includes('push'))                             return 'pushups';
    if (name.includes('dip'))                              return 'dips';
    if (name.includes('chin'))                             return 'chinups';
    if (name.includes('australian'))                       return 'australian-pullups';
    if (name.includes('muscle'))                           return 'muscle-ups';
    if (name.includes('pull'))                             return 'pullups';
    if (name.includes('pistol'))                           return 'pistol-squats';
    if (name.includes('jump') && name.includes('squat'))   return 'jump-squats';
    if (name.includes('squat'))                            return 'squats';
    if (name.includes('lunge'))                            return 'lunges';
    if (name.includes('calf'))                             return 'calf-raises';
    if (name.includes('side') && name.includes('plank'))   return 'side-plank';
    if (name.includes('plank'))                            return 'plank';
    if (name.includes('leg raise'))                        return 'leg-raises';
    if (name.includes('crunch'))                           return 'crunches';
    if (name.includes('mountain'))                         return 'mountain-climbers';
    if (name.includes('burpee'))                           return 'burpees';
    if (name.includes('jumping jack'))                     return 'jumping-jacks';
    if (name.includes('high knee'))                        return 'high-knees';
    return 'default';
  }

  /** SVG généré dynamiquement (affiché si pas d'image) */
  get svgContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getSvg());
  }

  private getSvg(): string {
    const color = this.getCategoryColor();
    const name = this.exerciseName.toLowerCase();

    if (name.includes('push') || name.includes('dip')) {
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="22" r="9" fill="${color}"/>
        <rect x="20" y="33" width="20" height="9" rx="4" fill="${color}"/>
        <rect x="14" y="44" width="9" height="26" rx="4" fill="${color}"/>
        <rect x="27" y="44" width="9" height="26" rx="4" fill="${color}"/>
        <line x1="8" y1="50" x2="48" y2="50" stroke="${color}" stroke-width="7" stroke-linecap="round"/>
      </svg>`;
    }

    if (name.includes('pull') || name.includes('chin') || name.includes('muscle')) {
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="84" height="8" rx="4" fill="${color}"/>
        <circle cx="50" cy="32" r="9" fill="${color}"/>
        <rect x="42" y="43" width="16" height="26" rx="4" fill="${color}"/>
        <rect x="34" y="68" width="11" height="22" rx="4" fill="${color}"/>
        <rect x="55" y="68" width="11" height="22" rx="4" fill="${color}"/>
        <line x1="50" y1="18" x2="50" y2="43" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
      </svg>`;
    }

    if (name.includes('squat') || name.includes('lunge') || name.includes('calf')) {
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="18" r="9" fill="${color}"/>
        <rect x="42" y="29" width="16" height="26" rx="4" fill="${color}"/>
        <rect x="34" y="54" width="13" height="30" rx="4" fill="${color}"/>
        <rect x="53" y="54" width="13" height="30" rx="4" fill="${color}"/>
        <rect x="28" y="81" width="20" height="7" rx="3" fill="${color}"/>
        <rect x="52" y="81" width="20" height="7" rx="3" fill="${color}"/>
      </svg>`;
    }

    if (name.includes('plank') || name.includes('crunch') || name.includes('leg raise')) {
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="38" r="8" fill="${color}"/>
        <rect x="28" y="36" width="48" height="11" rx="5" fill="${color}"/>
        <rect x="18" y="49" width="11" height="22" rx="4" fill="${color}"/>
        <rect x="68" y="49" width="11" height="22" rx="4" fill="${color}"/>
        <rect x="12" y="68" width="17" height="9" rx="4" fill="${color}"/>
        <rect x="62" y="68" width="17" height="9" rx="4" fill="${color}"/>
      </svg>`;
    }

    if (name.includes('burpee') || name.includes('jump') || name.includes('mountain') || name.includes('high')) {
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="22" r="9" fill="${color}"/>
        <rect x="42" y="33" width="16" height="22" rx="4" fill="${color}"/>
        <line x1="28" y1="38" x2="44" y2="44" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
        <line x1="72" y1="38" x2="56" y2="44" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
        <rect x="38" y="55" width="11" height="26" rx="4" fill="${color}"/>
        <rect x="51" y="55" width="11" height="26" rx="4" fill="${color}"/>
        <circle cx="35" cy="12" r="4" fill="${color}" opacity="0.5"/>
        <circle cx="65" cy="12" r="4" fill="${color}" opacity="0.5"/>
      </svg>`;
    }

    // Défaut
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="28" r="11" fill="${color}"/>
      <rect x="40" y="41" width="20" height="30" rx="5" fill="${color}"/>
      <rect x="34" y="70" width="13" height="22" rx="4" fill="${color}"/>
      <rect x="53" y="70" width="13" height="22" rx="4" fill="${color}"/>
    </svg>`;
  }

  private getCategoryColor(): string {
    switch (this.category) {
      case 'PUSH': return '#f5c518';
      case 'PULL': return '#ffe033';
      case 'LEGS': return '#c9a010';
      case 'CORE': return '#f5c518';
      default:     return '#f5c518';
    }
  }
}
