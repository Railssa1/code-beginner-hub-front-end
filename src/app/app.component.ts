import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { NgIf } from '@angular/common';
import { AuthGuard } from './auth.guard';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent, NgIf],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthGuard) {}

  shouldShowNavbar(): boolean {
    return this.authService.isAuthenticated();
  }
}
