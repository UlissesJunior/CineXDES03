// Tipagem para requisição por ID ou título
export interface OMDbRequestByIdOrTitle {
    i?: string;     // IMDb ID
    t?: string;     // Movie title
    type?: 'movie' | 'series' | 'episode';  // Type of result
    y?: string;     // Year of release
    plot?: 'short' | 'full';  // Plot type
    r?: 'json' | 'xml';  // Response format
  }
  
  // Tipagem para requisição de busca
  export interface OMDbSearchRequest {
    Search: never[];
    s: string;      // Movie title to search for
    type?: 'movie' | 'series' | 'episode';  // Type of result
    y?: string;     // Year of release
    r?: 'json' | 'xml';  // Response format
    page?: number;  // Page number (1-100)
  }
  
  // Tipagem para retorno de busca por ID ou título
  export interface OMDbMovie {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Array<{
      Source: string;
      Value: string;
    }>;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
  }
  
  // Tipagem para retorno de busca por termo
  export interface OMDbSearchResult {
    Search: Array<{
      Title: string;
      Year: string;
      imdbID: string;
      Type: string;
      Poster: string;
    }>;
    totalResults: string;
    Response: string;
  }
  