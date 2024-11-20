import { Routes } from '@angular/router';

import { AuthGuard } from '@guard/auth.guard';
import { LoginGuard } from '@guard/login.guard';
import { ContentSearchComponent } from '@components/content-search/content-search.component'; 
import { MovieDetailsComponent } from '@components/movie-details/movie-details.component'; 
import { LoginComponent } from '@components/login/login.component';
import { SignUpComponent } from '@components/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'populares',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [LoginGuard],
    title: 'CineNTT - Cadastro',
  },
  {
    path: 'populares',
    component: ContentSearchComponent,
    canActivate: [AuthGuard], 
    title: 'CineNTT - Populares',
  },
  {
    path: 'favoritos',
    component: ContentSearchComponent,
    canActivate: [AuthGuard], 
    title: 'CineNTT - Favoritos',
  },
  {
    path: 'search',
    component: ContentSearchComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'movie/:title',
    component: MovieDetailsComponent, 
    canActivate: [AuthGuard], 
    title: 'CineNTT - Detalhes do Filme',
  },
  {
    path: '**', 
    redirectTo: 'login',
  },
];