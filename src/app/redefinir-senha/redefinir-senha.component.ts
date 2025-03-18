import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EsqueciSenhaService } from '../services/esqueci-senha.service';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css'],
  imports: [ReactiveFormsModule]
})
export class RedefinirSenhaComponent implements OnInit {
  redefinirSenhaForm!: FormGroup;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private esqueciSenhaService: EsqueciSenhaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.redefinirSenhaForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value ? null : { passwordsMismatch: true };
  }

  isInvalid(field: string): boolean {
    const control = this.redefinirSenhaForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.redefinirSenhaForm.invalid) {
      this.redefinirSenhaForm.markAllAsTouched();
      return;
    }

    const newPassword = this.redefinirSenhaForm.value.newPassword;
    this.esqueciSenhaService.resetPassword(this.email, newPassword).subscribe(
      () => {
        this.snackBar.open('Senha redefinida com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-sucesso']
        });
        this.router.navigate(['/login']);
      },
      error => {
        this.snackBar.open('Erro ao redefinir senha. Tente novamente.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-erro']
        });
      }
    );
  }
}
