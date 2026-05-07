import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Workout } from '../../../shared/models/workout.model';

/**
 * Composant détail d'une séance.
 * Affiche le détail complet d'une séance avec ses exercices.
 */
@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.css']
})
export class WorkoutDetailComponent implements OnInit {

  workout: Workout | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadWorkout(+id);
    }
  }

  loadWorkout(id: number): void {
    this.apiService.get<Workout>(`/workouts/${id}`).subscribe({
      next: (data) => {
        this.workout = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Séance introuvable.';
        this.isLoading = false;
      }
    });
  }

  deleteWorkout(): void {
    if (!this.workout?.id) return;
    if (!confirm('Supprimer cette séance définitivement ?')) return;

    this.apiService.delete(`/workouts/${this.workout.id}`).subscribe({
      next: () => {
        this.router.navigate(['/workouts']);
      },
      error: () => {
        alert('Erreur lors de la suppression.');
      }
    });
  }
}
