import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service gÃ©nÃ©rique pour toutes les requÃªtes HTTP vers l'API backend.
 * Centralise l'URL de base et fournit des mÃ©thodes CRUD rÃ©utilisables.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL de base de l'API
  // Docker : backend exposÃ© sur port 8081, CORS autorisÃ© depuis http://localhost
  private readonly BASE_URL = 'http://localhost:8080/api';

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
