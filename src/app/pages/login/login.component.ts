import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthsService } from '../../services/auths/auths.service';
import { UsersService } from '../../services/users/users.service';
import { SharingService } from '../../services/sharing/sharing.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  fauthService: AuthsService = inject(AuthsService);
  userService: UsersService = inject(UsersService);
  sharingSrv: SharingService = inject(SharingService);
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);

  rememberMe: boolean = false;
  passwordVisible: boolean = false;

  displayName: any;
  loginFrm!: FormGroup;

  constructor() {
    this.sharingSrv.isUserLoggedIn.subscribe((value) => {
      console.log(value)
      if (value) {
        this.userService
          .getCurrentUser()
          .then((user) => {
            this.displayName =
              user.displayName != null ? user.displayName : user.email;
            console.log(this.displayName);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        this.displayName = '';
      }
    });
  }

  ngOnInit() {
    console.log('Login component initialized');
    this.loginFrm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.rememberMe = localStorage.getItem('rememberMe') === 'true';

    // Khôi phục giá trị từ localStorage nếu rememberMe là true
    if (this.rememberMe) {
      const savedEmail = localStorage.getItem('email');
      if (savedEmail) {
        this.loginFrm.patchValue({ email: savedEmail });
      }
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const inputType = this.passwordVisible ? 'text' : 'password';
    document.getElementById('inputPassword')?.setAttribute('type', inputType);
  }

  onRememberMeChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.rememberMe = checkbox.checked;
    localStorage.setItem('rememberMe', this.rememberMe.toString());

    if (this.rememberMe) {
      localStorage.setItem('email', this.loginFrm.get('email')?.value);
    } else {
      localStorage.removeItem('email');
    }
  }

  getUser() {
    if (this.rememberMe) {
      localStorage.setItem('email', this.loginFrm.get('email')?.value);
    } else {
      localStorage.removeItem('email');
    }

    if (this.loginFrm.invalid) {
      return;
    }

    const email = this.loginFrm.controls['email'].value;
    const password = this.loginFrm.controls['password'].value;

    this.fauthService
      .emailSignIn(email, password)
      .then((res) => {
        console.log(res);
        this.router.navigate(['/admin']).then(() => {
          setTimeout(() => {
            alert('Logged in successfully');
          }, 100); // Delay in milliseconds
        });
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  }

  googleLogin() {
    this.fauthService
      .googleSignIn()
      .then((res) => {
        this.router.navigate(['/admin']).then(() => {
          setTimeout(() => {
            alert('Logged in successfully');
          }, 100); // Delay in milliseconds
        });
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  }

  facebookLogin() {
    this.fauthService
      .facebookSignIn()
      .then((res) => {
        this.router.navigate(['/admin']).then(() => {
          setTimeout(() => {
            alert('Logged in successfully');
          }, 100); // Delay in milliseconds
        });
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  }

  twitterLogin() {
    this.fauthService
      .twitterSignIn()
      .then((res) => {
        this.router.navigate(['/admin']).then(() => {
          setTimeout(() => {
            alert('Logged in successfully');
          }, 100); // Delay in milliseconds
        });
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  }

  githubLogin() {
    this.fauthService
      .githubSignIn()
      .then((res) => {
        this.router.navigate(['/admin']).then(() => {
          setTimeout(() => {
            alert('Logged in successfully');
          }, 100); // Delay in milliseconds
        });
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  }

  navigateMain(): void {
    this.router.navigate(['/admin']);
  }
}
