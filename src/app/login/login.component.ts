import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [RouterModule]
})
export class LoginComponent {

  constructor(private router: Router) {}

  redirecionar(tipo: string) {
    this.router.navigate(['/cadastro-usuario'], { queryParams: { tipo } });
  }

}
