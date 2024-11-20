import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment.development'; 

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly apiKey = environment.TOKEN_TMDB;

  constructor(private http: HttpClient) {}

  getPopularMovies(page: number = 1): Observable<any> {

    const params = new HttpParams()   
    .set('api_key', this.apiKey)
    .set('page', page.toString())
    .set('include_adult', 'false') 

    return this.http.get(`${this.BASE_URL}/movie/popular`, { params });
  }

  searchMovies(query: string): Observable<any> {
    const params = new HttpParams().set('api_key', this.apiKey).set('query', query);
    return this.http.get(`${this.BASE_URL}/search/movie`, { params });
  }
}