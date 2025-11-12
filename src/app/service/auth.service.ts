import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  username: string;
  password?: string;
  email?: string;
  createdAt: Date;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email?: string;
    createdAt: Date;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUser: User | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Check if user is authenticated from localStorage
   */
  private checkAuthStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  /**
   * Register a new user
   * @param username - Username for the new user
   * @param password - Password for the new user
   * @param email - Optional email address
   * @returns Observable with success status and message
   */
  register(username: string, password: string, email?: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username,
      password,
      email
    }).pipe(
      map(response => ({
        success: response.success,
        message: response.message
      })),
      catchError(error => {
        console.error('Registration error:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erro ao cadastrar usuário'
        });
      })
    );
  }

  /**
   * Login with username and password
   * @param username - Username to validate
   * @param password - Password to validate
   * @returns Observable<boolean> - true if credentials match, false otherwise
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.currentUser = {
            username: response.user.username,
            email: response.user.email,
            createdAt: new Date(response.user.createdAt)
          };
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', username);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      map(response => response.success),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current logged in user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current username from localStorage
   */
  getCurrentUsername(): string | null {
    return localStorage.getItem('currentUser');
  }

  /**
   * Get test credentials for display (optional - for display purposes)
   */
  getTestCredentials(): { username: string; password: string } {
    return {
      username: 'admin',
      password: 'admin123'
    };
  }
}
