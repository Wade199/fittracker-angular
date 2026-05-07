import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Exercise } from '../../../shared/models/exercise.model';

/**
 * Composant détail d'un exercice.
 * Affiche toutes les informations d'un exercice sélectionné.
 */
@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.css']
})
export class ExerciseDetailComponent implements OnInit {

  exercise: Exercise | null = null;
  isLoading = true;
  errorMessage = '';

  difficultyLabels: Record<string, string> = {
    BEGINNER: 'Débutant',
    INTERMEDIATE: 'Intermédiaire',
    ADVANCED: 'Avancé'
  };

  categoryLabels: Record<string, string> = {
    PUSH: '💪 Push',
    PULL: '🔙 Pull',
    LEGS: '🦵 Jambes',
    CORE: '🎯 Core'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadExercise(+id);
    }
  }

  loadExercise(id: number): void {
    this.apiService.get<Exercise>(`/exercises/${id}`).subscribe({
      next: (data) => {
        this.exercise = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Exercice introuvable.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/exercises']);
  }
}
