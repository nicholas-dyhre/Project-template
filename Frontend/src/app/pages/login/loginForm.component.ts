import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loginForm.component.html',
})
export class LoginFormComponent {
  form = input.required<FormGroup>();
  isLoading = input<boolean>(false);
  errorMessage = input<string>('');
  submitted = output<void>();

  onSubmit(): void {
    this.submitted.emit();
  }

  get email() {
    return this.form().get('email');
  }

  get password() {
    return this.form().get('password');
  }
}
