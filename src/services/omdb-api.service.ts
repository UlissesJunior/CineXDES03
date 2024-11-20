import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment.development';
import { OMDbRequestByIdOrTitle, OMDbSearchRequest, OMDbMovie, OMDbSearchResult } from '@models/omdbTypes';

@Injectable({
  providedIn: 'root'
})

export class OmdbApiService {

  private readonly BASE_URL = 'https://www.omdbapi.com/';

  constructor(private http: HttpClient) { }

  fetchMovieByIdOrTitle(params: OMDbRequestByIdOrTitle): Observable<OMDbMovie> {
    const httpParams = new HttpParams({ fromObject: { ...params, apikey: environment.TOKEN_OMDB } });
    return this.http.get<OMDbMovie>(this.BASE_URL, { params: httpParams });
  }

  searchMovies(params: OMDbSearchRequest): Observable<OMDbSearchResult> {
    const httpParams = new HttpParams({ fromObject: { ...params, apikey: environment.TOKEN_OMDB, page: params.page?.toString() || '1' } });
    return this.http.get<OMDbSearchResult>(this.BASE_URL, { params: httpParams });
  }
}