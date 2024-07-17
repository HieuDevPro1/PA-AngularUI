import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SharingService } from '../sharing/sharing.service';

@Injectable({
  providedIn: 'root',
})
export class AuthsService {
  fauth: Auth = inject(Auth);
  dataSharingService : SharingService = inject(SharingService)

  constructor(private router: Router) {}

  async createAccount(
    email: string,
    password: string,
    userName: string,
  ) {
    return await createUserWithEmailAndPassword(this.fauth, email, password)
      .then(async (result) => {
        var user = result.user;
        await updateProfile(user, { displayName: `${userName}` });
        console.log(user);
        return user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.error(`
          Code: ${errorCode}
          Message: ${errorMessage}
          Email: ${email}
          Credential: ${credential}
        `);
        throw error;
      });
  }

  async emailSignIn(username: string, password: string) {
    return await signInWithEmailAndPassword(this.fauth, username, password)
      .then((result) => {
        this.dataSharingService.isUserLoggedIn.next(true);
        var user = result.user;
        console.log(user);
        return user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.error(`
          Code: ${errorCode}
          Message: ${errorMessage}
          Email: ${email}
          Credential: ${credential}
        `);
        throw error;
      });
  }

  async googleSignIn() {
    var provider = new GoogleAuthProvider();
    return await signInWithPopup(this.fauth, provider)
      .then((result) => {
        this.dataSharingService.isUserLoggedIn.next(true);
        var user = result.user;
        console.log(user);
        return user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.error(`
        Code: ${errorCode}
        Message: ${errorMessage}
        Email: ${email}
        Credential: ${credential}
      `);
        throw error;
      });
  }

  async facebookSignIn() {
    var provider = new FacebookAuthProvider();
    return await signInWithPopup(this.fauth, provider)
      .then((result) => {
        this.dataSharingService.isUserLoggedIn.next(true);
        var user = result.user;
        console.log(user);
        return user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.error(`
        Code: ${errorCode}
        Message: ${errorMessage}
        Email: ${email}
        Credential: ${credential}
      `);
        throw error;
      });
  }

  async githubSignIn() {
    var provider = new GithubAuthProvider();
    return await signInWithPopup(this.fauth, provider)
      .then((result) => {
        this.dataSharingService.isUserLoggedIn.next(true);
        var user = result.user;
        console.log(user);
        return user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.error(`
        Code: ${errorCode}
        Message: ${errorMessage}
        Email: ${email}
        Credential: ${credential}
      `);
        throw error;
      });
  }

  async twitterSignIn() {
    var provider = new TwitterAuthProvider();
    return await signInWithPopup(this.fauth, provider)
      .then((result) => {
        this.dataSharingService.isUserLoggedIn.next(true);
        var user = result.user;
        console.log(user);
        return user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.error(`
        Code: ${errorCode}
        Message: ${errorMessage}
        Email: ${email}
        Credential: ${credential}
      `);
        throw error;
      });
  }

  signOutAccount() {
    return new Promise<any>((resolve, reject) => {
      if (this.fauth.currentUser) {
        this.fauth.signOut();
        this.dataSharingService.isUserLoggedIn.next(false);
        resolve('log out');
      } else {
        reject();
      }
    });
  }
}
