import { NgOptimizedImage } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../interface/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginError!: string | null;
  auth = inject(AuthService);
  fb = inject(FormBuilder);

  constructor() {
    effect(() => {
      this.loginError = this.auth.loginError();
    });
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  logInUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.auth.loginUser(this.loginForm.value as User);
  }
  loginWithGoogle() {
    this.auth.logInWithGoogle();
  }
}
