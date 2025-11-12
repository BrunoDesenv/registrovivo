import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  password: string;
  email?: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // In-memory user storage
  private users: User[] = [
    // Default admin user for testing
    {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      createdAt: new Date()
    }
  ];

  private currentUser: User | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {}

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
   * @returns Object with success status and message
   */
  register(username: string, password: string, email?: string): { success: boolean; message: string } {
    // Validate username
    if (!username || username.trim().length < 3) {
      return { success: false, message: 'Usuário deve ter pelo menos 3 caracteres' };
    }

    // Validate password
    if (!password || password.length < 6) {
      return { success: false, message: 'Senha deve ter pelo menos 6 caracteres' };
    }

    // Check if username already exists
    if (this.users.some(user => user.username === username)) {
      return { success: false, message: 'Usuário já existe' };
    }

    // Create new user
    const newUser: User = {
      username: username.trim(),
      password: password,
      email: email?.trim(),
      createdAt: new Date()
    };

    this.users.push(newUser);
    return { success: true, message: 'Usuário cadastrado com sucesso!' };
  }

  /**
   * Login with username and password
   * @param username - Username to validate
   * @param password - Password to validate
   * @returns true if credentials match, false otherwise
   */
  login(username: string, password: string): boolean {
    const user = this.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      this.currentUser = user;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', username);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
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
   * Get test credentials for display (optional - for display purposes)
   */
  getTestCredentials(): { username: string; password: string } {
    return {
      username: 'admin',
      password: 'admin123'
    };
  }

  /**
   * Get all registered users (for debugging - remove in production)
   */
  getAllUsers(): User[] {
    return this.users;
  }
}
