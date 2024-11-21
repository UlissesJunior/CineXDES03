import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  private baseUrl = 'http://localhost:3000/ratings';

  constructor(private http: HttpClient) {}

  getRating(email: string, imdbID: string): Observable<{ imdbID: string; rating: number }> {
    return this.http.get<{ imdbID: string; rating: number }>(`${this.baseUrl}?email=${email}&imdbID=${imdbID}`);
  }

  saveRating(email: string, imdbID: string, rating: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.baseUrl, { email, imdbID, rating });
  }
}