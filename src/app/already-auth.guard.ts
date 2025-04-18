import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

@Injectable({
  providedIn: 'root',
})
export class AlreadyAuthGuard implements CanActivate {
  constructor(private authGuard: AuthGuard, private router: Router) {}

  canActivate(): boolean {
    if (this.authGuard.isAuthenticated()) {
      this.router.navigate(['/topicos']);
      return false;
    }
    return true;
  }
}
