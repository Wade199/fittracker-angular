import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Progress } from '../../../shared/models/workout.model';

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

  newEntry: Progress = {
    progressDate: new Date().toISOString().split('T')[0],
    weight: undefined,
    notes: ''
  };

  // Dimensions du graphique SVG
  readonly chartW = 600;
  readonly chartH = 200;
  readonly padX   = 40;
  readonly padY   = 20;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void { this.loadProgress(); }

  loadProgress(): void {
    this.apiService.get<Progress[]>('/progress').subscribe({
      next: (data) => {
        this.progressList = data.sort((a, b) =>
          new Date(b.progressDate).getTime() - new Date(a.progressDate).getTime()
        );
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onSubmit(): void {
    if (!this.newEntry.progressDate) { this.errorMessage = 'La date est obligatoire.'; return; }
    this.isSubmitting = true;
    this.errorMessage = '';
    this.apiService.post<Progress>('/progress', this.newEntry).subscribe({
      next: (created) => {
        this.progressList.unshift(created);
        this.successMessage = 'Entrée enregistrée !';
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
      next: () => { this.progressList = this.progressList.filter(p => p.id !== id); }
    });
  }

  resetForm(): void {
    this.newEntry = { progressDate: new Date().toISOString().split('T')[0], weight: undefined, notes: '' };
  }

  getWeightDiff(index: number): number | null {
    if (index >= this.progressList.length - 1) return null;
    const c = this.progressList[index].weight;
    const p = this.progressList[index + 1].weight;
    if (!c || !p) return null;
    return +(c - p).toFixed(1);
  }

  get minWeight(): number | null {
    const w = this.progressList.map(p => p.weight).filter(x => x != null) as number[];
    return w.length ? Math.min(...w) : null;
  }

  get maxWeight(): number | null {
    const w = this.progressList.map(p => p.weight).filter(x => x != null) as number[];
    return w.length ? Math.max(...w) : null;
  }

  get latestWeight(): number | null { return this.progressList[0]?.weight || null; }

  // ── Graphique SVG ──────────────────────────────────────────────────

  /** Points du graphique (ordre chronologique) */
  get chartPoints(): { x: number; y: number; weight: number; date: string }[] {
    const data = [...this.progressList]
      .filter(p => p.weight != null)
      .reverse(); // ordre chronologique

    if (data.length < 2) return [];

    const weights = data.map(p => p.weight as number);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const rangeW = maxW - minW || 1;

    const innerW = this.chartW - this.padX * 2;
    const innerH = this.chartH - this.padY * 2;

    return data.map((p, i) => ({
      x: this.padX + (i / (data.length - 1)) * innerW,
      y: this.padY + (1 - ((p.weight as number) - minW) / rangeW) * innerH,
      weight: p.weight as number,
      date: p.progressDate
    }));
  }

  /** Polyline path pour la courbe */
  get chartPolyline(): string {
    return this.chartPoints.map(p => `${p.x},${p.y}`).join(' ');
  }

  /** Zone remplie sous la courbe */
  get chartArea(): string {
    if (!this.chartPoints.length) return '';
    const pts = this.chartPoints;
    const bottom = this.chartH - this.padY;
    return `M${pts[0].x},${bottom} ` +
           pts.map(p => `L${p.x},${p.y}`).join(' ') +
           ` L${pts[pts.length - 1].x},${bottom} Z`;
  }

  /** Labels Y (poids) */
  get chartYLabels(): { y: number; label: string }[] {
    const data = this.progressList.filter(p => p.weight != null);
    if (!data.length) return [];
    const weights = data.map(p => p.weight as number);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const rangeW = maxW - minW || 1;
    const innerH = this.chartH - this.padY * 2;
    return [0, 0.25, 0.5, 0.75, 1].map(t => ({
      y: this.padY + (1 - t) * innerH,
      label: (minW + t * rangeW).toFixed(0)
    }));
  }
}
