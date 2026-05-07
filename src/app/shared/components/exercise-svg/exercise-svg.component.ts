import { Component, Input } from '@angular/core';

/**
 * Composant SVG pour les exercices de street workout / calisthenics.
 * Affiche une illustration SVG adaptée à chaque exercice.
 */
@Component({
  selector: 'app-exercise-svg',
  templateUrl: './exercise-svg.component.html',
  styleUrls: ['./exercise-svg.component.css']
})
export class ExerciseSvgComponent {
  @Input() exerciseName = '';
  @Input() category = '';
  @Input() size: 'card' | 'detail' = 'card';

  /**
   * Retourne la clé SVG à afficher selon le nom de l'exercice
   */
  getSvgKey(): string {
    const name = this.exerciseName.toLowerCase();
    if (name.includes('push-up') || name.includes('pushup')) return 'pushup';
    if (name.includes('diamond')) return 'diamond-pushup';
    if (name.includes('pike')) return 'pike-pushup';
    if (name.includes('handstand')) return 'handstand';
    if (name.includes('dip')) return 'dips';
    if (name.includes('pull-up') || name.includes('pullup')) return 'pullup';
    if (name.includes('chin-up') || name.includes('chinup')) return 'chinup';
    if (name.includes('australian')) return 'australian';
    if (name.includes('muscle-up') || name.includes('muscleup')) return 'muscleup';
    if (name.includes('squat') && name.includes('pistol')) return 'pistol-squat';
    if (name.includes('squat') && name.includes('jump')) return 'jump-squat';
    if (name.includes('squat')) return 'squat';
    if (name.includes('lunge')) return 'lunge';
    if (name.includes('calf')) return 'calf-raise';
    if (name.includes('plank') && name.includes('side')) return 'side-plank';
    if (name.includes('plank')) return 'plank';
    if (name.includes('leg raise')) return 'leg-raise';
    if (name.includes('crunch')) return 'crunch';
    if (name.includes('mountain')) return 'mountain-climber';
    if (name.includes('burpee')) return 'burpee';
    if (name.includes('jumping jack')) return 'jumping-jack';
    if (name.includes('high knee')) return 'high-knee';
    // Fallback par catégorie
    if (this.category === 'PUSH') return 'pushup';
    if (this.category === 'PULL') return 'pullup';
    if (this.category === 'LEGS') return 'squat';
    return 'plank';
  }

  getCategoryGradient(): string {
    switch (this.category) {
      case 'PUSH': return 'url(#gradPush)';
      case 'PULL': return 'url(#gradPull)';
      case 'LEGS': return 'url(#gradLegs)';
      case 'CORE': return 'url(#gradCore)';
      default: return 'url(#gradPush)';
    }
  }
}
