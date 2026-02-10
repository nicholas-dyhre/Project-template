import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthError, RegisterRequest } from '../../api/generated-api-client';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
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

    return password && confirm && password !== confirm
      ? { passwordMismatch: true }
      : null;
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

    this.authService.register(request).subscribe({
      next: (res) => {
        if (res.success === true) {
          this.successMessage = 'Registration successful! Redirecting...';
          this.router.navigate(['/login']);
        } else {
          if (res?.errors?.length) {
            this.applyServerErrors(res.errors);
          } else {
            this.errorMessage = res?.message || 'Registration failed';
          }
        }        
      },
      error: (apiError) => {
        console.log('Registration error', apiError); // <-- now this should show { message, errors }

        this.isLoading = false;

        if (apiError?.errors?.length) {
          this.applyServerErrors(apiError.errors);
        } else {
          this.errorMessage = apiError?.message || 'Registration failed';
        }
      }
    });
  }

  private applyServerErrors(errors: AuthError[]) {
    const passwordErrors: string[] = [];
    let emailError: string | null = null;

    for (const err of errors) {
      if(err && err.code && err.description){
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

  private clearServerError(control: AbstractControl | null) {
    if (!control?.errors?.['server']) return;
    const { server, ...rest } = control.errors;
    control.setErrors(Object.keys(rest).length ? rest : null);
  }
}
