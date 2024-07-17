import { Injectable, inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  fauth: Auth = inject(Auth);
  constructor() {}

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      onAuthStateChanged(this.fauth, (user) => {
        // localStorage.getItem('uid')
        if (user) {
          console.log('user service', user);
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }
}
