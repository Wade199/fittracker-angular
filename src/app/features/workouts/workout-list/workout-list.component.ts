import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Workout, PagedResponse } from '../../../shared/models/workout.model';

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
    // Le backend renvoie une réponse paginée {content: [...]} ou un tableau simple
    this.apiService.get<PagedResponse<Workout> | Workout[]>('/workouts').subscribe({
      next: (response) => {
        const data = this.extractWorkouts(response);
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

  /**
   * Extrait le tableau quelle que soit la structure de réponse
   */
  private extractWorkouts(response: PagedResponse<Workout> | Workout[]): Workout[] {
    if (Array.isArray(response)) return response;
    if (response && (response as PagedResponse<Workout>).content) {
      return (response as PagedResponse<Workout>).content;
    }
    return [];
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
