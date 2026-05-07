import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard de protection des routes.
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    // Redirige vers la page de login si non connecté
    return this.router.createUrlTree(['/login']);
  }
}
