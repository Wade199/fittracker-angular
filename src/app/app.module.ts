import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Intercepteur JWT
import { JwtInterceptor } from './core/auth/jwt.interceptor';

// Shared components
import { HeaderComponent } from './shared/components/header/header.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ExerciseIconComponent } from './shared/components/exercise-icon/exercise-icon.component';

// Auth
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// Dashboard
import { DashboardComponent } from './features/dashboard/dashboard.component';

// Exercises
import { ExerciseListComponent } from './features/exercises/exercise-list/exercise-list.component';
import { ExerciseDetailComponent } from './features/exercises/exercise-detail/exercise-detail.component';

// Workouts
import { WorkoutListComponent } from './features/workouts/workout-list/workout-list.component';
import { WorkoutCreateComponent } from './features/workouts/workout-create/workout-create.component';
import { WorkoutDetailComponent } from './features/workouts/workout-detail/workout-detail.component';

// Progress
import { ProgressTrackerComponent } from './features/progress/progress-tracker/progress-tracker.component';

@NgModule({
  declarations: [
    AppComponent,
    // Shared
    HeaderComponent,
    LoaderComponent,
    ExerciseIconComponent,
    // Auth
    LoginComponent,
    RegisterComponent,
    // Dashboard
    DashboardComponent,
    // Exercises
    ExerciseListComponent,
    ExerciseDetailComponent,
    // Workouts
    WorkoutListComponent,
    WorkoutCreateComponent,
    WorkoutDetailComponent,
    // Progress
    ProgressTrackerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    // Enregistre l'intercepteur JWT pour toutes les requêtes HTTP
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
