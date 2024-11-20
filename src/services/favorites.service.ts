import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OMDbMovie } from '@services/models/omdbTypes';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getFavorites(email: string): Observable<OMDbMovie[]> {
    return this.http.get<OMDbMovie[]>(`${this.apiUrl}/favorites`, {
      params: { email },
    });
  }

  addFavorite(email: string, movie: OMDbMovie): Observable<any> {
    return this.http.put(`${this.apiUrl}/favorites`, { email, movie });
  }

  removeFavorite(email: string, imdbID: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites`, {
      body: { email, imdbID },
    });
  }
}
