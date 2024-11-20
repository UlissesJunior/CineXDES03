import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 
import { OmdbApiService } from '@services/omdb-api.service';
import { OMDbMovie } from '@services/models/omdbTypes';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent {
  movie: OMDbMovie | null = null;  
  loading = true;                  
  isFavorite = false;              

  constructor(
    private route: ActivatedRoute, 
    private omdbApiService: OmdbApiService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const movieTitle = this.route.snapshot.paramMap.get('title');
    if (movieTitle) {
      this.omdbApiService.fetchMovieByIdOrTitle({ t: movieTitle }).subscribe({
        next: (res: OMDbMovie) => {
          if (res.Response === 'False') {
            this.loading = false;
            this.redirectToHome(); 
          } else {
            this.movie = res;
            this.loading = false;
            this.checkIfFavorite(); 
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

  checkIfFavorite(): void {
    if (typeof window !== 'undefined' && sessionStorage.getItem('emailLogado')) {
      const emailLogado = sessionStorage.getItem('emailLogado');
      if (emailLogado && this.movie?.imdbID) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos') || '{}');
        this.isFavorite = favoritos[emailLogado]?.some((fav: any) => fav.imdbID === this.movie?.imdbID);
      }
    }
  }

  toggleFavorite(): void {
    const emailLogado = sessionStorage.getItem('emailLogado');
    if (!emailLogado || !this.movie?.imdbID) return;

    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '{}');

    if (!favoritos[emailLogado]) {
      favoritos[emailLogado] = [];
    }

    if (this.isFavorite) {
      favoritos[emailLogado] = favoritos[emailLogado].filter((fav: any) => fav.imdbID !== this.movie?.imdbID);
    } else {
      favoritos[emailLogado].push(this.movie);
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    this.isFavorite = !this.isFavorite;
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
