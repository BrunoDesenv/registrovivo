import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validate all fields
    if (!this.username || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return;
    }

    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    // Attempt to register
    this.authService.register(this.username, this.password, this.email).subscribe({
      next: (result) => {
        if (result.success) {
          this.successMessage = result.message;
          // Clear form
          this.username = '';
          this.password = '';
          this.confirmPassword = '';
          this.email = '';

          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = result.message;
        }
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
      }
    });
  }
}
