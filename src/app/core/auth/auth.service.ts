import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY  = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => this.setSession(response))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', data).pipe(
      tap(response => this.setSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  clearAllData(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Vérifie si l'utilisateur est connecté.
   * Retourne true si un token valide existe en localStorage.
   * En cas de doute (token malformé), retourne false sans boucler.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || token.trim() === '') return false;

    // Vérifie l'expiration seulement si le token a bien 3 parties
    const parts = token.split('.');
    if (parts.length !== 3) {
      // Token malformé → nettoie et retourne false
      localStorage.removeItem(this.TOKEN_KEY);
      return false;
    }

    try {
      // Décode le payload Base64
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(b64));

      // Si pas de champ exp → considère valide (certains backends n'expirent pas)
      if (!payload.exp) return true;

      // Marge de 30 secondes pour éviter les faux positifs
      return (payload.exp * 1000) > (Date.now() - 30000);
    } catch {
      // Erreur de décodage → token invalide, nettoie
      localStorage.removeItem(this.TOKEN_KEY);
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    const safeUser = {
      id:        authResponse.user.id,
      username:  authResponse.user.username,
      email:     authResponse.user.email,
      firstName: authResponse.user.firstName,
      lastName:  authResponse.user.lastName
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(safeUser));
    this.currentUserSubject.next(authResponse.user);
  }

  private getUserFromStorage(): User | null {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }
}
