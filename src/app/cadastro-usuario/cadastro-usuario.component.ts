import { UserEstudante, UserMentor } from './../interfaces/user.model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgIf } from '@angular/common';
import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CadastroUsuarioService } from '../services/cadastro-usuario.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css'],
  imports: [
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatSnackBarModule,
    RouterModule
  ],
  providers: [CadastroUsuarioService],
})
export class CadastroUsuarioComponent implements OnInit {
  cadastroForm!: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentSkill = model('');
  readonly skills = signal<string[]>([]);
  readonly allSkills: string[] = ['Front-End', 'Back-End', 'Segurança da informação', 'Banco de dados', 'Arquitetura', 'Cloud','Java', 'Python', 'HTML', 'CSS', 'JavaScript', 'C#', 'C++', 'Ruby'];
  readonly filteredSkills = computed(() => {
    const current = this.currentSkill().toLowerCase();
    return current ? this.allSkills.filter(skill => skill.toLowerCase().includes(current)) : this.allSkills.slice();
  });

  readonly announcer = inject(LiveAnnouncer);
  tipoUsuario = "";
  selectedSeniority: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cadastroUsuarioService: CadastroUsuarioService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.tipoUsuario = this.route.snapshot.queryParams["tipo"] || '';
    this.cadastroForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      seniority: [''],
      skills: [this.tipoUsuario === 'mentor' ? ['Full-Stack'] : [], [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.setValidatorsBasedOnUserType();
  }

  private setValidatorsBasedOnUserType() {
    if (this.tipoUsuario === 'mentor') {
      this.cadastroForm.get('seniority')?.setValidators([Validators.required]);
      this.cadastroForm.get('skills')?.setValidators([Validators.required]);
      this.skills.set(['Full-Stack']);
    } else {
      this.cadastroForm.get('seniority')?.clearValidators();
      this.cadastroForm.get('skills')?.clearValidators();
      this.cadastroForm.get('seniority')?.setValue(null);
      this.cadastroForm.get('skills')?.setValue([]);
      this.skills.set([]);
    }

    this.cadastroForm.get('seniority')?.updateValueAndValidity();
    this.cadastroForm.get('skills')?.updateValueAndValidity();
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { passwordsMismatch: true };
  }

  isInvalid(field: string) {
    const control = this.cadastroForm.get(field);
    return control?.invalid && control?.touched;
  }

  onSubmit() {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    this.tipoUsuario === 'estudante' ? this.createEstudante() : this.createMentor();
  }

  private createEstudante() {
    const body: UserEstudante = this.getEstudanteFormData();
    this.cadastroUsuarioService.createEstudante(body).subscribe(
      _ => {
        this.snackBar.open('Cadastro realizado com sucesso! Faça login.', 'Fechar', {
          duration: 20000,
          panelClass: ['snackbar-sucesso']
        });
        this.router.navigate(['/login']);
      },
      error => {
        if (error.status === 400) {
          this.snackBar.open('Usuário já cadastrado!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-erro']
          });
        } else {
          this.snackBar.open('Erro ao cadastrar. Tente novamente.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-erro']
          });
        }
      }
    );
  }

  private createMentor() {
    const body: UserMentor = this.getMentorFormData();
    this.cadastroUsuarioService.createMentor(body).subscribe(
      _ => {
        this.snackBar.open('Cadastro de mentor realizado com sucesso! Faça login.', 'Fechar', {
          duration: 20000,
          panelClass: ['snackbar-sucesso']
        });
        this.router.navigate(['/login']);
      },
      error => {
        if (error.status === 400) {
          this.snackBar.open('Usuário já cadastrado!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-erro'],

          });
        } else {
          this.snackBar.open('Erro ao cadastrar. Tente novamente.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-erro']
          });
        }
      }
    );
  }

  private getEstudanteFormData(): UserEstudante {
    return {
      email: this.cadastroForm.value.email,
      password: this.cadastroForm.value.password,
      name: this.cadastroForm.value.name,
    };
  }

  private getMentorFormData(): UserMentor {
    return {
      email: this.cadastroForm.value.email,
      password: this.cadastroForm.value.password,
      name: this.cadastroForm.value.name,
      skills: this.cadastroForm.value.skills,
      seniority: this.cadastroForm.value.seniority
    };
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.skills().includes(value)) {
      this.skills.update(skills => {
        const updatedSkills = [...skills, value];
        this.cadastroForm.controls['skills'].setValue(updatedSkills);
        this.cadastroForm.controls['skills'].updateValueAndValidity();
        return updatedSkills;
      });
    }
    this.currentSkill.set('');
  }

  remove(skill: string): void {
    this.skills.update(skills => {
      const updatedSkills = skills.filter(s => s !== skill);
      this.cadastroForm.controls['skills'].setValue(updatedSkills);
      this.cadastroForm.controls['skills'].updateValueAndValidity();
      this.announcer.announce(`Removed ${skill}`);
      return updatedSkills;
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;
    if (!this.skills().includes(selectedValue)) {
      this.skills.update(skills => {
        const updatedSkills = [...skills, selectedValue];
        this.cadastroForm.controls['skills'].setValue(updatedSkills);
        this.cadastroForm.controls['skills'].updateValueAndValidity();
        return updatedSkills;
      });
    }
    this.currentSkill.set('');
    event.option.deselect();
  }
}
