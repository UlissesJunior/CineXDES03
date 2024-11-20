import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { AuthenticatorService } from '@services/authenticator.service';

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  name: string = '';
  email: string = '';
  password: string = '';
  photo: File | null = null;
  photoPreview: any

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthenticatorService
  ) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photo = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(this.photo); // Converts to Base64
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.toastService.warn('Por favor, preencha todos os campos.');
      return;
    }

    if (this.password.length < 4) {
      this.toastService.warn('A senha deve ter no mínimo 4 caracteres.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.toastService.warn('Por favor, insira um e-mail válido.');
      return;
    }

    const user = {
      username: this.name,
      email: this.email,
      password: this.password,
      photo: this.photoPreview,
    };

    this.authService.signUp(user).subscribe({
      next: (response: any) => {
        if (response.message === 'Usuário criado com sucesso.') {
          this.toastService.success('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']);
        } else {
          this.toastService.error(response.message || 'Erro no cadastro.');
        }
      },
      error: (err: any) => {
        console.error(err);
        if (err.status === 409) {
          this.toastService.error('E-mail já cadastrado.');
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
}