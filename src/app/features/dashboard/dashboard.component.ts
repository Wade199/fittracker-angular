import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../shared/models/user.model';
import { Workout } from '../../shared/models/workout.model';

/**
 * Composant Dashboard.
 * Affiche un résumé : dernières séances, statistiques rapides.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: User | null = null;
  recentWorkouts: Workout[] = [];
  stats = {
    totalWorkouts: 0,
    thisWeek: 0,
    totalMinutes: 0
  };
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
    this.apiService.get<Workout[]>('/workouts').subscribe({
      next: (workouts) => {
        this.recentWorkouts = workouts.slice(0, 5); // 5 dernières séances
        this.computeStats(workouts);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private computeStats(workouts: Workout[]): void {
    this.stats.totalWorkouts = workouts.length;
    this.stats.totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    // Séances de la semaine courante
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    this.stats.thisWeek = workouts.filter(w => {
      const d = new Date(w.workoutDate);
      return d >= startOfWeek;
    }).length;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }
}
