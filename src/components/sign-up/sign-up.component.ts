import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  name: string = '';
  email: string = '';
  photo: File | null = null;
  photoPreview: string | ArrayBuffer | null = null;

  constructor(private router: Router, private toastService: ToastService) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photo = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(this.photo);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    if (this.name && this.email && this.photo) {
      if (!this.email || !this.isValidEmail(this.email)) {
        this.toastService.warn('Por favor, insira um e-mail válido.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const photoDataUrl = reader.result as string;

        const dadosUsuariosLocais = JSON.parse(
          localStorage.getItem('dadosUsuariosLocais') || '{}'
        );
        if (!dadosUsuariosLocais[this.email]) {
          dadosUsuariosLocais[this.email] = {
            nome: this.name,
            photo: photoDataUrl,
          };
          localStorage.setItem(
            'dadosUsuariosLocais',
            JSON.stringify(dadosUsuariosLocais)
          );
          this.toastService.success('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']);
        } else {
          this.toastService.error('E-mail já cadastrado.');
        }
      };

      reader.readAsDataURL(this.photo);
    } else {
      this.toastService.warn('Por favor, preencha todos os campos.');
    }
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}
