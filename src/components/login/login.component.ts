import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { AuthenticatorService } from '@services/authenticator.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthenticatorService
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password || !this.isValidEmail(this.email)) {
      this.toastService.warn('Por favor, insira um e-mail e senha válidos.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        if (response.message === 'Autenticado com Sucesso') {
          sessionStorage.setItem('emailLogado', this.email);
          this.toastService.success('Login realizado com sucesso!');
          this.router.navigate(['/populares']);
        } else {
          this.toastService.error(response);
        }
      },
      error: (err: any) => {
        console.log(err.error.message);
        if(err.error.message === 'Email inválido') {
          this.toastService.error('Email inválido');
        } else if (err.error.message === 'Senha incorreta') {
          this.toastService.error('Senha incorreta');
        } else {
          this.toastService.error('Erro ao se comunicar com o servidor.');
        }
      },
    });
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  navigateToSignUp(): void {
    this.router.navigate(['/signup']);
  }
}