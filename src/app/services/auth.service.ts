import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../interface/user';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  registerUser(user: User) {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(() => {
        this.sendEmailVerification();
      });
  }
  loginUser(user: User) {
    return this.afAuth.signInWithEmailAndPassword(user.email, user.password);
  }

  logoutUser() {
    return this.afAuth.signOut();
  }
  getCurrentUser() {
    return this.afAuth.authState;
  }

  logInWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }
  sendEmailVerification() {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        user.sendEmailVerification();
        alert('Verification Email sent');
      }
      throw new Error('User ');
    });
  }
}
