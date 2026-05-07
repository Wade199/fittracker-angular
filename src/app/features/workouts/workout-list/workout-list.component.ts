import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Workout } from '../../../shared/models/workout.model';

/**
 * Composant liste des séances d'entraînement.
 * Affiche toutes les séances de l'utilisateur connecté.
 */
@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent implements OnInit {

  workouts: Workout[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.apiService.get<Workout[]>('/workouts').subscribe({
      next: (data) => {
        // Tri par date décroissante
        this.workouts = data.sort((a, b) =>
          new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime()
        );
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les séances.';
        this.isLoading = false;
      }
    });
  }

  deleteWorkout(id: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!confirm('Supprimer cette séance ?')) return;

    this.apiService.delete(`/workouts/${id}`).subscribe({
      next: () => {
        this.workouts = this.workouts.filter(w => w.id !== id);
      },
      error: () => {
        alert('Erreur lors de la suppression.');
      }
    });
  }
}
