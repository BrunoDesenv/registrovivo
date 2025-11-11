import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Fixed credentials for testing
  private readonly FIXED_USERNAME = 'admin';
  private readonly FIXED_PASSWORD = 'admin123';

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
   * Login with fixed credentials
   * @param username - Username to validate
   * @param password - Password to validate
   * @returns true if credentials match, false otherwise
   */
  login(username: string, password: string): boolean {
    if (username === this.FIXED_USERNAME && password === this.FIXED_PASSWORD) {
      localStorage.setItem('isLoggedIn', 'true');
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get fixed credentials for testing (optional - for display purposes)
   */
  getTestCredentials(): { username: string; password: string } {
    return {
      username: this.FIXED_USERNAME,
      password: this.FIXED_PASSWORD
    };
  }
}
