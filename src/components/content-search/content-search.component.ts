import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { MovieCardsComponent } from '@components/movie-cards/movie-cards.component';
import { TmdbService } from '@services/tmdb-api.service';
import { OMDbMovie, OMDbSearchRequest } from '@services/models/omdbTypes';
import { OmdbApiService } from '@services/omdb-api.service';
import { SearchService } from '@services/search.service';
import { TmdbMovie } from '@services/models/tmdbTypes';
import { FavoritesService } from '@services/favorites.service';

@Component({
  selector: 'content-search',
  standalone: true,
  imports: [CommonModule, MovieCardsComponent],
  templateUrl: './content-search.component.html',
  styleUrls: ['./content-search.component.scss'],
})
export class ContentSearchComponent implements OnInit, OnDestroy {
  movies: OMDbMovie[] | TmdbMovie[] = [];
  loading = true;
  currentPage: number = 1;
  totalPages: number = 1;
  private searchSubscription!: Subscription;
  emailLogado: string = ''; 

  constructor(
    private tmdbService: TmdbService,
    private omdbService: OmdbApiService,
    private searchService: SearchService,
    private favoritesService: FavoritesService, // Serviço para gerenciar favoritos
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.emailLogado = sessionStorage.getItem('emailLogado') || '';
      
      this.route.url.subscribe((urlSegment) => {
        if (urlSegment.length > 0 && urlSegment[0].path === 'favoritos') {
          this.loadFavorites();
        } else {
          const lastSearchText = this.searchService.getLastSearchText();
          if (lastSearchText) {
            this.searchMovies(lastSearchText, 1);
          } else {
            this.loadPopularMovies(1);
          }
  
          this.searchSubscription = this.searchService.searchText$.subscribe((query) => {
            this.searchMovies(query, 1);
          });
        }
      });
    }
  }

  loadFavorites(): void {
    if (this.emailLogado) {
      this.loading = true;
      this.favoritesService.getFavorites(this.emailLogado).subscribe({
        next: (favorites) => {
          this.movies = this.parseFavoriteMovies(favorites); 
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao buscar favoritos do servidor:', error);
          this.movies = [];
          this.loading = false;
        },
      });
    }
  }

  loadPopularMovies(page: number = 1): void {
    this.loading = true;
    this.tmdbService.getPopularMovies(page).subscribe({
      next: (response) => {
        this.movies = response.results.map((movie: any) => ({
          title: movie.title,
          release_date: movie.release_date,
          poster_path: 'https://image.tmdb.org/t/p/w500' + movie.poster_path,
        }));
        this.totalPages = 500;
        this.currentPage = page;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching popular movies:', error);
        this.loading = false;
      },
    });
  }

  searchMovies(query: string, page: number = 1): void {
    if (!query) {
      this.loadPopularMovies(page);
      return;
    }

    this.loading = true;

    const params: any = {
      s: query,
      type: 'movie',
      page: page,
    };

    this.omdbService.searchMovies(params).subscribe({
      next: (response) => {
        this.movies = this.parseOmdbMovies(response);
        this.totalPages = Math.ceil(Number(response.totalResults) / 10);
        this.currentPage = page;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar filmes:', err);
        this.loading = false;
      },
    });
  }

  onPageChange(newPage: number): void {
    const lastSearchText = this.searchService.getLastSearchText();
    if (lastSearchText) {
      this.searchMovies(lastSearchText, newPage);
    } else {
      this.loadPopularMovies(newPage);
    }
  }

  getPagesToShow(): number[] {
    const pagesToShow: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, this.currentPage + 2);
  
    if (this.currentPage <= 3) {
      endPage = Math.min(maxPagesToShow, this.totalPages);
    } else if (this.currentPage >= this.totalPages - 2) {
      startPage = Math.max(this.totalPages - maxPagesToShow + 1, 1);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }
  
    return pagesToShow;
  }

  parseOmdbMovies(response: any): OMDbMovie[] {
    return response.Search.map((movie: any) => ({
      title: movie.Title,
      release_date: movie.Year,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : 'na-movie.png',
    }));
  }

  parseFavoriteMovies(favorites: OMDbMovie[]): OMDbMovie[] {
    return favorites.map<any>((movie) => ({
      title: movie.Title,
      release_date: movie.Year,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : 'na-movie.png',
    }));
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
