import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../interface/user';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  registerError = signal<string | null>(null);
  loginError = signal<string | null>(null);

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  async registerUser(user: User) {
    try {
      await this.afAuth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );

      const sendVerificationPromise = this.sendEmailVerification();

      const navigatePromise = this.router.navigate(['/login']);

      await Promise.all([sendVerificationPromise, navigatePromise]);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.registerError.set('This email address is already in use.');
      } else {
        this.registerError.set(`An unexpected error occured,please try again`);
      }
    }
  }
  async loginUser(user: User) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        user.email,
        user.password
      );

      if (result.user?.emailVerified) {
        await this.router.navigate(['/chat']);
      } else {
        this.loginError.set('Email is not verified kindly verify you email');
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        this.loginError.set('Invalid credential');
      } else {
        this.loginError.set('Unexpected error occurred .Please try again');
      }
    }
  }

  logoutUser() {
    return this.afAuth.signOut();
  }
  getCurrentUser() {
    return this.afAuth.authState;
  }

  async logInWithGoogle() {
    try {
      const result = await this.afAuth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      );
      const verificationPromise = this.sendEmailVerification();
      let navigatePromise: Promise<boolean>;
      if (result.user?.emailVerified) {
        navigatePromise = this.router.navigate(['/chat']);
      } else {
        navigatePromise = Promise.resolve(false);
      }

      await Promise.all([verificationPromise, navigatePromise]);
    } catch (error) {
      console.log('Error logging in with google ', error);
    }
  }
  async resetPassword(email: string) {
    await this.afAuth.sendPasswordResetEmail(email);
    alert('Link to reset your email as been sent to your email');

    await this.router.navigate(['/login']);
  }
  sendEmailVerification() {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        user.sendEmailVerification();
        alert('Registered successfully,Kindly verify you email to login');
      }
      throw new Error('User ');
    });
  }
}
