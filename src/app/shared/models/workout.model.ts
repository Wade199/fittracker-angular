import { Exercise } from './exercise.model';

/**
 * Utilisé côté formulaire (création de séance) — ce qu'on ENVOIE au backend
 */
export interface WorkoutExercise {
  id?: number;
  exerciseId: number;
  exercise?: Exercise;      // objet local pour l'affichage dans le formulaire
  sets: number;
  reps: number;
}

/**
 * Ce que le backend RENVOIE dans WorkoutResponse.WorkoutExerciseResponse
 * Le backend retourne exerciseName, category, difficulty directement (pas d'objet exercise imbriqué)
 */
export interface WorkoutExerciseResponse {
  id?: number;
  exerciseId: number;
  exerciseName: string;
  category: string;
  difficulty: string;
  sets: number;
  reps: number;
}

/**
 * Workout tel que renvoyé par le backend (GET /workouts, GET /workouts/:id)
 */
export interface Workout {
  id?: number;
  userId?: number;
  title: string;
  workoutDate: string;
  duration?: number;       // en minutes
  totalCalories?: number;
  notes?: string;
  // Le backend renvoie WorkoutExerciseResponse[], pas WorkoutExercise[]
  exercises?: WorkoutExerciseResponse[];
  createdAt?: string;
}

/**
 * Payload envoyé au backend pour créer une séance (POST /workouts)
 */
export interface WorkoutCreateRequest {
  title: string;
  workoutDate: string;
  duration?: number;
  totalCalories?: number;
  notes?: string;
  exercises: { exerciseId: number; sets: number; reps: number }[];
}

export interface Progress {
  id?: number;
  userId?: number;
  progressDate: string;
  weight?: number;
  notes?: string;
  createdAt?: string;
}
