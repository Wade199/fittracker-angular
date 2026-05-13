import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../shared/models/user.model';
import { Workout, PagedResponse } from '../../shared/models/workout.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: User | null = null;
  recentWorkouts: Workout[] = [];
  stats = { totalWorkouts: 0, thisWeek: 0, totalMinutes: 0 };
  isLoading = true;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Le backend renvoie une réponse paginée {content: [...], totalElements: N, ...}
    this.apiService.get<PagedResponse<Workout> | Workout[]>('/workouts').subscribe({
      next: (response) => {
        // Gère les deux formats : paginé et tableau simple
        const workouts = this.extractWorkouts(response);
        this.recentWorkouts = workouts.slice(0, 5);
        this.computeStats(workouts);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Extrait le tableau de workouts quelle que soit la structure de réponse
   */
  private extractWorkouts(response: PagedResponse<Workout> | Workout[]): Workout[] {
    if (Array.isArray(response)) {
      return response;
    }
    // Réponse paginée Spring : { content: [...] }
    if (response && (response as PagedResponse<Workout>).content) {
      return (response as PagedResponse<Workout>).content;
    }
    return [];
  }

  private computeStats(workouts: Workout[]): void {
    this.stats.totalWorkouts = workouts.length;
    this.stats.totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    this.stats.thisWeek = workouts.filter(w => {
      return new Date(w.workoutDate) >= startOfWeek;
    }).length;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }
}
