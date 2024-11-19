/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon - 2 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  passwordView: boolean = false;
  errorMessage: string = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() { }

  ngOnInit() {
    // Carga los valores desde el localStorage
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (storedEmail) {
      this.email = storedEmail;
    }

    if (storedPassword) {
      this.password = storedPassword;
    }
  }

  togglePassword() {
    this.passwordView = !this.passwordView;
  }

  onLogin() {
    if (this.authService.login(this.email, this.password)) {
      // Guarda los valores en el localStorage
      localStorage.setItem('email', this.email);
      localStorage.setItem('password', this.password);

      console.log('Login exitoso');
      this.router.navigate(['/appointments']);
    } else {
      console.log('Credenciales incorrectas');
      this.errorMessage = 'Credenciales incorrectas';
    }
  }


}
