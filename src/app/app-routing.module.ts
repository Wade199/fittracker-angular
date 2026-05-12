import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

// Auth
import { LoginComponent }    from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// Features
import { DashboardComponent }       from './features/dashboard/dashboard.component';
import { ExerciseListComponent }    from './features/exercises/exercise-list/exercise-list.component';
import { ExerciseDetailComponent }  from './features/exercises/exercise-detail/exercise-detail.component';
import { WorkoutListComponent }     from './features/workouts/workout-list/workout-list.component';
import { WorkoutCreateComponent }   from './features/workouts/workout-create/workout-create.component';
import { WorkoutDetailComponent }   from './features/workouts/workout-detail/workout-detail.component';
import { ProgressTrackerComponent } from './features/progress/progress-tracker/progress-tracker.component';
import { ProfileComponent }         from './features/profile/profile.component';

// Legal & 404
import { PrivacyPolicyComponent } from './features/legal/privacy-policy/privacy-policy.component';
import { NotFoundComponent }      from './features/not-found/not-found.component';

const routes: Routes = [
  // Racine → dashboard (AuthGuard gère la redirection vers login si besoin)
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Routes publiques — pas de guard
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'privacy',  component: PrivacyPolicyComponent },

  // Routes protégées
  { path: 'dashboard',       component: DashboardComponent,       canActivate: [AuthGuard] },
  { path: 'exercises',       component: ExerciseListComponent,    canActivate: [AuthGuard] },
  { path: 'exercises/:id',   component: ExerciseDetailComponent,  canActivate: [AuthGuard] },
  { path: 'workouts',        component: WorkoutListComponent,     canActivate: [AuthGuard] },
  { path: 'workouts/create', component: WorkoutCreateComponent,   canActivate: [AuthGuard] },
  { path: 'workouts/:id',    component: WorkoutDetailComponent,   canActivate: [AuthGuard] },
  { path: 'progress',        component: ProgressTrackerComponent, canActivate: [AuthGuard] },
  { path: 'profile',         component: ProfileComponent,         canActivate: [AuthGuard] },

  // 404 — doit être en dernier
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Évite les erreurs de navigation en double
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
