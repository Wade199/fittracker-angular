import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service générique pour toutes les requêtes HTTP vers l'API backend.
 * Centralise l'URL de base et fournit des méthodes CRUD réutilisables.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL de base de l'API
  // En Docker : Nginx proxifie /api → backend:8080 (pas de CORS)
  // En local  : pointe directement vers http://localhost:8080/api
  private readonly BASE_URL = '/api';

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.BASE_URL}${path}`, { params });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.BASE_URL}${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.BASE_URL}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.BASE_URL}${path}`);
  }
}
