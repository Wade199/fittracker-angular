import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { RegisterRequest } from '../../../shared/models/user.model';

/**
 * Composant d'inscription.
 * Formulaire complet avec validation.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  formData: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  confirmPassword = '';
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Si déjà connecté → redirige vers dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    // Validation
    if (!this.formData.username || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    if (this.formData.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription.';
      }
    });
  }
}
