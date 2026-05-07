import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Progress } from '../../../shared/models/workout.model';

/**
 * Composant suivi des progrès.
 * Permet d'enregistrer et visualiser l'évolution du poids.
 */
@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.css']
})
export class ProgressTrackerComponent implements OnInit {

  progressList: Progress[] = [];
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  // Formulaire nouvelle entrée
  newEntry: Progress = {
    progressDate: new Date().toISOString().split('T')[0],
    weight: undefined,
    notes: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    this.apiService.get<Progress[]>('/progress').subscribe({
      next: (data) => {
        // Tri par date décroissante
        this.progressList = data.sort((a, b) =>
          new Date(b.progressDate).getTime() - new Date(a.progressDate).getTime()
        );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.newEntry.progressDate) {
      this.errorMessage = 'La date est obligatoire.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.apiService.post<Progress>('/progress', this.newEntry).subscribe({
      next: (created) => {
        this.progressList.unshift(created);
        this.successMessage = 'Entrée enregistrée avec succès !';
        this.showForm = false;
        this.resetForm();
        this.isSubmitting = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'enregistrement.';
      }
    });
  }

  deleteEntry(id: number): void {
    if (!confirm('Supprimer cette entrée ?')) return;

    this.apiService.delete(`/progress/${id}`).subscribe({
      next: () => {
        this.progressList = this.progressList.filter(p => p.id !== id);
      }
    });
  }

  resetForm(): void {
    this.newEntry = {
      progressDate: new Date().toISOString().split('T')[0],
      weight: undefined,
      notes: ''
    };
  }

  /**
   * Calcule la variation de poids entre deux entrées consécutives
   */
  getWeightDiff(index: number): number | null {
    if (index >= this.progressList.length - 1) return null;
    const current = this.progressList[index].weight;
    const previous = this.progressList[index + 1].weight;
    if (!current || !previous) return null;
    return +(current - previous).toFixed(1);
  }

  /**
   * Poids min et max pour les stats
   */
  get minWeight(): number | null {
    const weights = this.progressList.map(p => p.weight).filter(w => w != null) as number[];
    return weights.length ? Math.min(...weights) : null;
  }

  get maxWeight(): number | null {
    const weights = this.progressList.map(p => p.weight).filter(w => w != null) as number[];
    return weights.length ? Math.max(...weights) : null;
  }

  get latestWeight(): number | null {
    return this.progressList[0]?.weight || null;
  }
}
