import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthError, AuthResult, RegisterRequest } from '../../api/generated-api-client';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.registerForm = this.fb.group(
      {
        fullName: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnInit(): void {
    this.password?.valueChanges.subscribe(() => this.clearServerError(this.password));
    this.email?.valueChanges.subscribe(() => this.clearServerError(this.email));
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;

    return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { fullName, email, password } = this.registerForm.value;
    const request = new RegisterRequest({ fullName, email, password });

    this.authService
      .register(request)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res: AuthResult) => {
          if (res.success === true) {
            this.successMessage = 'Registration successful! Redirecting...';
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = res?.message || 'Registration failed';
          }
        },
        error: (apiError: AuthResult) => {
          if (apiError?.errors?.length) {
            this.applyServerErrors(apiError.errors);
          } else {
            this.errorMessage = apiError?.message || 'Registration failed';
          }
        },
      });
  }

  private applyServerErrors(errors: AuthError[]) {
    const passwordErrors: string[] = [];
    let emailError: string | null = null;

    for (const err of errors) {
      if (err && err.code && err.description) {
        if (err?.code?.startsWith('Password')) {
          passwordErrors.push(err?.description);
        }

        if (err.code === 'DuplicateEmail' || err.code === 'DuplicateUserName') {
          emailError = err.description;
        }
      }
    }

    if (passwordErrors.length) {
      this.password?.setErrors({ server: passwordErrors });
      this.password?.markAsTouched();
    }

    if (emailError) {
      this.email?.setErrors({ server: emailError });
      this.email?.markAsTouched();
    }
  }

  private clearServerError(control: AbstractControl | null): void {
    if (!control) return;

    const errors: ValidationErrors | null = control.errors;

    if (!errors || !('server' in errors)) return;

    const remainingErrors: ValidationErrors = { ...errors };
    delete remainingErrors['server'];

    control.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
  }

  get confirmPasswordErrors(): ValidationErrors | null {
    return this.confirmPassword?.errors ?? null;
  }

  get confirmPasswordTouched(): boolean {
    return this.confirmPassword?.touched ?? false;
  }

  get emailErrors(): ValidationErrors | null {
    return this.email?.errors ?? null;
  }

  get passwordErrors(): ValidationErrors | null {
    return this.password?.errors ?? null;
  }

  get emailTouched(): boolean {
    return this.email?.touched ?? false;
  }

  get passwordTouched(): boolean {
    return this.password?.touched ?? false;
  }

  get passwordServerErrors(): string[] {
    return this.password?.errors?.['server'] ?? [];
  }
}
