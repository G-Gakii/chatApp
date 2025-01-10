import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  auth = inject(AuthService);
  email!: string;
  errorMsg = '';

  resetPassword() {
    if (this.email) {
      this.auth.resetPassword(this.email);
    } else {
      this.errorMsg = 'Email required';
    }
  }
}
