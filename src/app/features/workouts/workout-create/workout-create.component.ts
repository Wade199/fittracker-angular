import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Workout, WorkoutExercise, WorkoutCreateRequest } from '../../../shared/models/workout.model';
import { Exercise } from '../../../shared/models/exercise.model';

/**
 * Composant création d'une séance.
 * Formulaire pour créer une nouvelle séance avec ses exercices.
 */
@Component({
  selector: 'app-workout-create',
  templateUrl: './workout-create.component.html',
  styleUrls: ['./workout-create.component.css']
})
export class WorkoutCreateComponent implements OnInit {

  // Liste locale des exercices ajoutés (avec l'objet Exercise pour l'affichage)
  localExercises: WorkoutExercise[] = [];

  workout = {
    title: '',
    workoutDate: new Date().toISOString().split('T')[0],
    duration: undefined as number | undefined,
    totalCalories: undefined as number | undefined,
    notes: ''
  };

  availableExercises: Exercise[] = [];
  selectedExerciseId: number | null = null;
  isLoading = false;
  isLoadingExercises = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.apiService.get<Exercise[]>('/exercises').subscribe({
      next: (data) => {
        this.availableExercises = data;
        this.isLoadingExercises = false;
      },
      error: () => {
        this.isLoadingExercises = false;
      }
    });
  }

  /**
   * Ajoute un exercice à la séance
   */
  addExercise(): void {
    if (!this.selectedExerciseId) return;

    const exercise = this.availableExercises.find(e => e.id === +this.selectedExerciseId!);
    if (!exercise) return;

    // Vérifie si déjà ajouté
    const alreadyAdded = this.localExercises.some(e => e.exerciseId === exercise.id);
    if (alreadyAdded) {
      this.errorMessage = 'Cet exercice est déjà dans la séance.';
      return;
    }

    this.localExercises.push({
      exerciseId: exercise.id,
      exercise: exercise,
      sets: 3,
      reps: 10
    });

    this.selectedExerciseId = null;
    this.errorMessage = '';
  }

  /**
   * Supprime un exercice de la séance
   */
  removeExercise(index: number): void {
    this.localExercises.splice(index, 1);
  }

  /**
   * Soumet le formulaire
   */
  onSubmit(): void {
    if (!this.workout.title || !this.workout.workoutDate) {
      this.errorMessage = 'Le titre et la date sont obligatoires.';
      return;
    }

    if (this.localExercises.length === 0) {
      this.errorMessage = 'Ajoutez au moins un exercice.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Payload conforme au backend WorkoutRequest
    const payload: WorkoutCreateRequest = {
      title: this.workout.title,
      workoutDate: this.workout.workoutDate,
      duration: this.workout.duration,
      totalCalories: this.workout.totalCalories,
      notes: this.workout.notes,
      exercises: this.localExercises.map(e => ({
        exerciseId: e.exerciseId,
        sets: e.sets,
        reps: e.reps
      }))
    };

    this.apiService.post<Workout>('/workouts', payload).subscribe({
      next: (created) => {
        this.router.navigate(['/workouts', created.id]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création.';
      }
    });
  }
}
