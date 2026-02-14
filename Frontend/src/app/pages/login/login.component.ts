import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { finalize } from 'rxjs';
import { AuthResult, LoginRequest } from '../../api/generated-api-client';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;
      const loginRequest = new LoginRequest({ email, password });
      this.authService.login(loginRequest).pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      ).subscribe({
        next: res => {
          if (res.success) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.errorMessage = res.message || 'Login failed';
          }
        },
        error: err => {
          const authResult = err?.result as AuthResult;
          this.errorMessage = authResult?.message || 'Invalid credentials';
        }
      }); 
    }
  }
}
