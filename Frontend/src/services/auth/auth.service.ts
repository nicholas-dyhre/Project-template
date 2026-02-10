import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { ApiClient, AuthResult, LoginRequest, RegisterRequest, User } from '../../app/api/generated-api-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiClient: ApiClient
  ) {
    // Check if user is already logged in on app initialization
    this.checkAuthStatus();
  }

  /**
   * Check if user is authenticated by checking for access token
   */
  private checkAuthStatus(): void {
    const token = this.getAccessToken();
    if (token) {
      // Verify token is still valid by calling /me endpoint
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        },
        error: () => {
          // Token invalid, try to refresh
          this.refreshToken().subscribe();
        }
      });
    }
  }

  register(request: RegisterRequest): Observable<AuthResult> {
    return this.apiClient.auth_Register(request);
  }

  /**
   * Login with email and password
   */
  login(request: LoginRequest): Observable<AuthResult> {
    return this.apiClient.auth_Login(request);
  }

  /**
   * Logout the current user
   */
  logout(): Observable<any> {
    return this.apiClient.auth_Logout();
  }

  /**
   * Refresh the access token using the refresh token cookie
   */
  refreshToken(): Observable<AuthResult> {
    return this.apiClient.auth_RefreshToken().pipe(
      tap(response => {
        this.setAccessToken(response.accessToken);
        this.getCurrentUser().subscribe(user => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        });
      }),
      catchError(error => {
        this.clearTokens();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return of(error);
      })
    );
  }

  /**
   * Get current user details
   */
  getCurrentUser(): Observable<User> {
    return this.apiClient.auth_GetCurrentUser();
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Store access token in localStorage
   */
  private setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  /**
   * Clear all tokens
   */
  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    // Refresh token is in HttpOnly cookie, can't access from JS (good for security)
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user value (synchronous)
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
