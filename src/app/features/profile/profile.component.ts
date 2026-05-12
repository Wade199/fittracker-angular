import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  isLoading = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  form = {
    firstName: '',
    lastName: '',
    username: '',
    height: undefined as number | undefined,
    weight: undefined as number | undefined
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.apiService.get<User>('/users/me').subscribe({
      next: (u) => {
        this.user = u;
        this.form = {
          firstName: u.firstName || '',
          lastName:  u.lastName  || '',
          username:  u.username,
          height:    u.height,
          weight:    u.weight
        };
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onSave(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.put<User>('/users/me', this.form).subscribe({
      next: (updated) => {
        this.user = updated;
        this.successMessage = 'Profil mis à jour avec succès !';
        this.isSaving = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour.';
        this.isSaving = false;
      }
    });
  }

  onDeleteAccount(): void {
    if (!confirm('Supprimer définitivement votre compte et toutes vos données ? Cette action est irréversible.')) return;
    this.apiService.delete('/users/me').subscribe({
      next: () => { this.authService.clearAllData(); },
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  getBmi(): string {
    if (!this.user?.height || !this.user?.weight) return '—';
    const h = this.user.height / 100;
    return (this.user.weight / (h * h)).toFixed(1);
  }
}
