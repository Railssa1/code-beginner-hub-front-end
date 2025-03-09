import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Login } from '../interfaces/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [RouterModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const body: Login = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.loginService.login(body).subscribe(
        response => console.log(response),
        error => console.error(error)
      );
    }
  }

  redirecionar(tipo: string) {
    this.router.navigate(['/cadastro-usuario'], { queryParams: { tipo } });
  }

}
