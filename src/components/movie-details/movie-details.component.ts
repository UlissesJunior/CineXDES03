import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 
import { OmdbApiService } from '@services/omdb-api.service';
import { OMDbMovie } from '@services/models/omdbTypes';
import { FavoritesService } from '@services/favorites.service';
import { RatingsService } from '@services/avaliacoes.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  movie: OMDbMovie | null = null;  
  loading = true;                  
  isFavorite = false;              
  userRating: number | null = null; 
  editingRating = false;           

  constructor(
    private route: ActivatedRoute, 
    private omdbApiService: OmdbApiService, 
    private router: Router,
    private favoritesService: FavoritesService, 
    private ratingsService: RatingsService // Injeção do serviço de avaliações
  ) {}

  ngOnInit(): void {
    const movieTitle = this.route.snapshot.paramMap.get('title');
    const emailLogado = sessionStorage.getItem('emailLogado');

    if (!emailLogado) {
      this.redirectToHome();
      return;
    }

    if (movieTitle) {
      this.omdbApiService.fetchMovieByIdOrTitle({ t: movieTitle }).subscribe({
        next: (res: OMDbMovie) => {
          if (res.Response === 'False') {
            this.loading = false;
            this.redirectToHome(); 
          } else {
            this.movie = res;
            this.loading = false;
            this.checkIfFavorite(emailLogado); 
            this.loadUserRating(emailLogado); 
          }
        },
        error: (error: any) => {
          console.error('Erro ao buscar detalhes do filme:', error);
          this.loading = false;
          this.redirectToHome(); 
        }
      });
    } else {
      this.loading = false;
      this.redirectToHome();
    }
  }

  checkIfFavorite(email: string): void {
    if (!this.movie?.imdbID) return;

    this.favoritesService.getFavorites(email).subscribe({
      next: (favoritos) => {
        this.isFavorite = favoritos.some((fav) => fav.imdbID === this.movie?.imdbID);
      },
      error: (error) => {
        console.error('Erro ao verificar favoritos:', error);
      }
    });
  }

  loadUserRating(email: string): void {
    if (!this.movie?.imdbID) return;

    this.ratingsService.getRating(email, this.movie.imdbID).subscribe({
      next: (rating: any) => {
        this.userRating = rating.rating;
      },
      error: (error: any) => {
        console.error('Erro ao carregar avaliação:', error);
      }
    });
  }

  saveRating(newRating: number): void {
    const emailLogado = sessionStorage.getItem('emailLogado');
    if (!emailLogado || !this.movie?.imdbID) return;

    this.ratingsService.saveRating(emailLogado, this.movie.imdbID, newRating).subscribe({
      next: () => {
        this.userRating = newRating;
        this.editingRating = false;
      },
      error: (error: any) => {
        console.error('Erro ao salvar avaliação:', error);
      }
    });
  }

  toggleFavorite(): void {
    const emailLogado = sessionStorage.getItem('emailLogado');
    if (!emailLogado || !this.movie?.imdbID) return;

    if (this.isFavorite) {
      this.favoritesService.removeFavorite(emailLogado, this.movie.imdbID).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (error) => {
          console.error('Erro ao remover dos favoritos:', error);
        }
      });
    } else {
      this.favoritesService.addFavorite(emailLogado, this.movie).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (error) => {
          console.error('Erro ao adicionar aos favoritos:', error);
        }
      });
    }
  }

  redirectToHome(): void {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000); 
  }

  getStarClass(star: number): string {
    if (star === 1) {
      return 'bi bi-star-fill'; 
    } else if (star === 0.5) {
      return 'bi bi-star-half'; 
    } else {
      return 'bi bi-star'; 
    }
  }

  getStarsArray(): number[] {
    const maxStars = 5;

    if (!this.movie || !this.movie.imdbRating) {
      return Array(maxStars).fill(0);  
    }

    let rating = +this.movie.imdbRating / 2; 
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 0.5 : 0;
    const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill(1),  
      ...(halfStar ? [0.5] : []),   
      ...Array(emptyStars).fill(0)   
    ];
  }
}