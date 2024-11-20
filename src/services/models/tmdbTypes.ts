export interface TmdbMovie {
    poster_path: string;
    title: string;
    release_date: string;
    id: number;
  }
  
  export interface TmdbMovieResponse {
    page: number;
    results: TmdbMovie[];
    total_results: number;
    total_pages: number;
  }
  