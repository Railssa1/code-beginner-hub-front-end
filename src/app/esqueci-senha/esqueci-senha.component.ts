import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EsqueciSenhaService } from '../services/esqueci-senha.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.css'],
  imports: [ReactiveFormsModule, NgIf]
})
export class EsqueciSenhaComponent implements OnInit {
  esqueciSenhaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private esqueciSenhaService: EsqueciSenhaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.esqueciSenhaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void { }

  isInvalid(field: string): boolean {
    const control = this.esqueciSenhaForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.esqueciSenhaForm.invalid) {
      this.esqueciSenhaForm.markAllAsTouched();
      return;
    }

    const email = this.esqueciSenhaForm.value.email;
    this.esqueciSenhaService.sendResetLink(email).subscribe(
      () => {
        this.snackBar.open('Link de redefinição de senha enviado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-sucesso']
        });
        this.router.navigate(['/login']);
      },
      error => {
        this.snackBar.open('Erro ao enviar link de redefinição de senha. Tente novamente.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-erro']
        });
      }
    );
  }
}
