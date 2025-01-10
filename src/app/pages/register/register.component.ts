import { NgOptimizedImage } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interface/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerError!: string | null;
  fb = inject(FormBuilder);
  auth = inject(AuthService);

  constructor() {
    effect(() => {
      this.registerError = this.auth.registerError();
    });
  }

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/),
      ],
    ],
  });

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.auth.registerUser(this.registerForm.value as User);
  }
  loginWithGoogle() {
    this.auth.logInWithGoogle();
  }
}
