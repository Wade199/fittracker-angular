export type ExerciseCategory = 'PUSH' | 'PULL' | 'LEGS' | 'CORE';
export type ExerciseDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Exercise {
  id: number;
  name: string;
  description?: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  muscleGroup?: string;
  imageUrl?: string;
  createdAt?: string;
}
