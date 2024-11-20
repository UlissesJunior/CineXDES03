import { Router } from '@angular/router';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SearchService } from '@services/search.service';
import { AuthenticatorService } from '@services/authenticator.service';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements AfterViewInit {
  isDropdownVisible = false;
  isMenuVisible = false;
  private searchTextChanged = new Subject<string>();
  usuarioImagem: any = null;
  usuarioNome: string = '';
  searchText: string = '';

  constructor(
    private searchService: SearchService,
    private router: Router,
    private authService: AuthenticatorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.searchTextChanged.pipe(debounceTime(500)).subscribe((searchText) => {
      this.searchService.emitSearchText(searchText);

      if (searchText.trim()) {
        this.router.navigate(['/search']);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.getImagemUsuario();
    }
  }

  ngAfterViewInit(): void {}

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  onSearchTextChanged(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTextChanged.next(inputElement.value);
  }

  getImagemUsuario(): void {
    if (isPlatformBrowser(this.platformId)) {
      const emailLogado = sessionStorage.getItem('emailLogado');

      if (emailLogado) {
        this.authService.getUserByEmail(emailLogado).subscribe({
          next: (user) => {
            this.usuarioImagem = user.photo || null;
            this.usuarioNome = user.username;
            console.log(this.usuarioImagem)
          },
          error: (err) => {
            console.error('Erro ao buscar dados do usuário:', err);
            this.usuarioImagem = null;
          },
        });
      }
    }
  }

  signOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('emailLogado');
    }
    this.router.navigate(['/login']);
  }

  navigateToPopulares(): void {
    this.router.navigate(['/populares']);
  }

  navigateToFavoritos(): void {
    this.router.navigate(['/favoritos']);
  }
}