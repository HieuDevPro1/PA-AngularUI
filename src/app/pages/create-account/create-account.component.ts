import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { AuthsService } from '../../services/auths/auths.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
})
export class CreateAccountComponent {
  fauthService: AuthsService = inject(AuthsService);
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  registerFrm!: FormGroup;

  ngOnInit() {
    this.registerFrm = this.fb.group(
      {
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const inputType = this.passwordVisible ? 'text' : 'password'
    document.getElementById('inputPassword')?.setAttribute('type', inputType)
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
    const inputType = this.confirmPasswordVisible ? 'text' : 'password'
    document.getElementById('inputConfirmPassword')?.setAttribute('type', inputType)
  }

  createUser() {
    if (this.registerFrm.invalid) {
      return;
    }

    const userName = this.registerFrm.controls['userName'].value;
    const email = this.registerFrm.controls['email'].value;
    const password = this.registerFrm.controls['password'].value;

    this.fauthService
      .createAccount(email, password, userName)
      .then((res) => {
        console.log(res);
        alert('Your account has been created');
        this.router.navigate(['/']);
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
