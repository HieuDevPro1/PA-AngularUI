import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthsService } from '../../services/auths/auths.service';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  displayName: any;
  userService: UsersService = inject(UsersService);
  router: Router = inject(Router);

  fauthService: AuthsService = inject(AuthsService);

  constructor() {
    this.userService.getCurrentUser().then((user) => {
      this.displayName =
        user.displayName != null ? user.displayName : user.email;
      console.log('display Name:', this.displayName);
    });
  }

  logOut() {
    this.fauthService.signOutAccount();
    // location.href="/login";
    this.router.navigate(['/login'])
  }

  navigateLogIn() {
    this.router.navigate(['/']);
  }

  ngOnInit() {}
}
