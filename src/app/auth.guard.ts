import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token && !this.isTokenExpired(token)) {
      return true;
    } else {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (!decoded.exp) {
        return true;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}
