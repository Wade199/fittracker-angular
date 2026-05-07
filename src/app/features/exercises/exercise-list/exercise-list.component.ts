import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Exercise, ExerciseCategory, ExerciseDifficulty } from '../../../shared/models/exercise.model';

/**
 * Composant liste des exercices.
 * Affiche tous les exercices avec filtres par catégorie et difficulté.
 */
@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent implements OnInit {

  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  isLoading = true;

  // Filtres
  searchTerm = '';
  selectedCategory: ExerciseCategory | '' = '';
  selectedDifficulty: ExerciseDifficulty | '' = '';

  categories: ExerciseCategory[] = ['PUSH', 'PULL', 'LEGS', 'CORE'];
  difficulties: ExerciseDifficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  // Labels français
  categoryLabels: Record<ExerciseCategory, string> = {
    PUSH: '💪 Push',
    PULL: '🔙 Pull',
    LEGS: '🦵 Jambes',
    CORE: '🎯 Core'
  };

  difficultyLabels: Record<ExerciseDifficulty, string> = {
    BEGINNER: 'Débutant',
    INTERMEDIATE: 'Intermédiaire',
    ADVANCED: 'Avancé'
  };

  difficultyColors: Record<ExerciseDifficulty, string> = {
    BEGINNER: '#c9a010',
    INTERMEDIATE: '#f5c518',
    ADVANCED: '#ffe033'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.apiService.get<Exercise[]>('/exercises').subscribe({
      next: (data) => {
        this.exercises = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredExercises = this.exercises.filter(ex => {
      const matchSearch = !this.searchTerm ||
        ex.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (ex.muscleGroup || '').toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchCategory = !this.selectedCategory || ex.category === this.selectedCategory;
      const matchDifficulty = !this.selectedDifficulty || ex.difficulty === this.selectedDifficulty;

      return matchSearch && matchCategory && matchDifficulty;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedDifficulty = '';
    this.applyFilters();
  }
}
