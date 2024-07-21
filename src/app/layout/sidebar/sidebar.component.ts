import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthsService } from '../../services/auths/auths.service';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  displayName: any;
  userService: UsersService = inject(UsersService);
  router: Router = inject(Router);
  fauthService: AuthsService = inject(AuthsService);
  currentTab: string = '';

  sidebarOpened: boolean = false;

  constructor() {
    this.userService.getCurrentUser().then((user) => {
      this.displayName =
        user.displayName != null ? user.displayName : user.email;
      console.log('display Name:', this.displayName);
    });
  }

  navigateDashboard(): void {
    this.currentTab = 'dashboard';
    this.router.navigate(['/admin/dashboard'])
  }

  navigateTable(): void {
    this.currentTab = 'table';
    this.router.navigate(['/admin/table'])
  }

  navigateCreateAccount(): void {
    this.router.navigate(['/create-account'])
  }

  navigateLogin(): void {
    this.router.navigate(['/login'])
  }

  navigateChart(): void {
    this.currentTab = 'chart';
    this.router.navigate(['/admin/chart'])
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar) {
      sidebar.classList.toggle('active', this.sidebarOpened);
    }
    if (overlay) {
      overlay.classList.toggle('active', this.sidebarOpened);
    }
  }

  closeSidebar() {
    this.sidebarOpened = false;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar) {
      sidebar.classList.remove('active');
    }
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
  
}
