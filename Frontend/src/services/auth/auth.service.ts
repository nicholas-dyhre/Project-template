import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of, throwError } from 'rxjs';
import {
  ApiClient,
  AuthResult,
  FileResponse,
  LoginRequest,
  RegisterRequest,
  UserDto,
} from '../../app/api/generated-api-client';
import { LocalStorageService } from '../localStorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageService = inject(LocalStorageService);
  private apiClient = inject(ApiClient);
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  /**
   * Check if user is authenticated by checking for access token
   */
  public checkAuthStatus(): void {
    const token = this.localStorageService.getAccessToken();
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
        },
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
    return this.apiClient.auth_Login(request).pipe(
      tap((response) => {
        // Store access token
        this.localStorageService.setAccessToken(response.accessToken);

        // Update user state
        this.currentUserSubject.next(response.user);

        // Mark authenticated
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((err) => {
        console.log('clear 2');
        this.localStorageService.clearTokens();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return throwError(() => err);
      }),
    );
  }

  /**
   * Logout the current user
   */
  logout(): Observable<FileResponse> {
    return this.apiClient.auth_Logout().pipe(
      tap(() => {
        this.localStorageService.clearTokens();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }),
    );
  }

  /**
   * Refresh the access token using the refresh token cookie
   */
  refreshToken(): Observable<AuthResult> {
    return this.apiClient.auth_RefreshToken().pipe(
      tap((response) => {
        this.localStorageService.setAccessToken(response.accessToken);
        this.getCurrentUser().subscribe((user) => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        });
      }),
      catchError((error) => {
        console.log('err', error);
        this.localStorageService.clearTokens();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return of(error);
      }),
    );
  }

  /**
   * Get current user details
   */
  getCurrentUser(): Observable<UserDto> {
    return this.apiClient.auth_GetCurrentUser();
  }

  /**
   * Get access token from localStorage
   */

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user value (synchronous)
   */
  getCurrentUserValue(): UserDto | null {
    return this.currentUserSubject.value;
  }
}
