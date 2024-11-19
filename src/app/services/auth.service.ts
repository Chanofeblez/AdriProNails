import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERNAME = 'adriana.gandol@yahoo.com';
  private readonly PASSWORD = 'Abcd1234$$$$';

  private router = inject(Router);

  constructor() {}

  login(username: string, password: string): boolean {
    if (username === this.USERNAME && password === this.PASSWORD) {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/appointments']); // Redirige automáticamente a la página de inicio
        return true;
    }
    return false;
}


logout(): void {
  localStorage.removeItem('email');
  localStorage.removeItem('password');
  localStorage.removeItem('isLoggedIn');
  this.router.navigate(['/login']);
}


  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
