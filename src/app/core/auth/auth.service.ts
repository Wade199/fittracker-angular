import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/user.model';

/**
 * Service d'authentification — Sécurisé RGPD/Production
 *
 * Sécurité :
 * - Token JWT stocké en sessionStorage (effacé à la fermeture du navigateur)
 * - Données utilisateur minimales stockées (pas de données sensibles)
 * - Déconnexion automatique sur token expiré (401)
 * - Pas de mot de passe stocké côté client
 */
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
    // Supprime toutes les données de session
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Supprime toutes les données personnelles (droit à l'effacement RGPD)
   */
  clearAllData(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // Vérifie si le token JWT est expiré
    return !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Stocke uniquement les données nécessaires (principe de minimisation RGPD)
   * Pas de données sensibles (pas de mot de passe, pas de données de santé brutes)
   */
  private setSession(authResponse: AuthResponse): void {
    sessionStorage.setItem(this.TOKEN_KEY, authResponse.token);

    // Stocke uniquement les données non-sensibles
    const safeUser = {
      id:        authResponse.user.id,
      username:  authResponse.user.username,
      email:     authResponse.user.email,
      firstName: authResponse.user.firstName,
      lastName:  authResponse.user.lastName
      // ⚠️ height/weight ne sont PAS stockés côté client (données de santé = sensibles RGPD)
    };

    sessionStorage.setItem(this.USER_KEY, JSON.stringify(safeUser));
    this.currentUserSubject.next(authResponse.user);
  }

  private getUserFromStorage(): User | null {
    const userJson = sessionStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Vérifie si le token JWT est expiré en décodant le payload
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry  = payload.exp * 1000; // convertit en ms
      return Date.now() > expiry;
    } catch {
      return true; // token malformé = considéré expiré
    }
  }
}
