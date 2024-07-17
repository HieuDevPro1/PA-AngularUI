import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  usersSrv: UsersService = inject(UsersService);
  public isUserLoggedIn: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {
    this.usersSrv.getCurrentUser().then((user) => {
      if (user) {
        this.isUserLoggedIn.next(true);
      }
    });
  }
}
