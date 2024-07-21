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

  sidebarOpened: boolean = false;

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

  navigateDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  ngOnInit() {}

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active');
    }
  }
}
