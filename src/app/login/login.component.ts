import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  showCredentials: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/diary']);
        } else {
          this.errorMessage = 'Credenciais inválidas';
          this.password = '';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Erro ao fazer login. Tente novamente.';
        this.password = '';
      }
    });
  }

  getTestCredentials() {
    return this.authService.getTestCredentials();
  }
}
