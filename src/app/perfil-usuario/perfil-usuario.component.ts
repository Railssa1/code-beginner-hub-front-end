import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UserEstudante, UserMentor } from '../interfaces/user.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { model, signal, computed } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css'],
  imports: [
    MatSnackBarModule,
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgFor
  ],
})
export class PerfilUsuarioComponent implements OnInit {
  email = (localStorage.getItem('usuario') || '').replace(/"/g, '');
  userForm!: FormGroup;
  user!: UserMentor | UserEstudante;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentSkill = model('');
  readonly skills = signal<string[]>([]);
  readonly allSkills: string[] = ['Front-End', 'Back-End', 'Segurança da informação', 'Banco de dados', 'Arquitetura', 'Cloud','Java', 'Python', 'HTML', 'CSS', 'JavaScript', 'C#', 'C++', 'Ruby'];
  readonly filteredSkills = computed(() => {
    const current = this.currentSkill().toLowerCase();
    return current ? this.allSkills.filter(skill => skill.toLowerCase().includes(current)) : this.allSkills.slice();
  });

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.getUserByEmail(this.email).subscribe(
      (data: UserMentor | UserEstudante) => {
        this.user = data;
        this.initializeForm();
      },
      () => {
        this.snackBar.open('Erro ao buscar dados do usuário', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-erro'],
        });
      }
    );
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      email: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email]],
      name: [this.user.name, Validators.required],
      seniority: [this.isMentor(this.user) ? this.user.seniority : ''],
      skills: [this.isMentor(this.user) ? this.user.skills : []],
    });

    if (this.isMentor(this.user)) {
      this.userForm.get('seniority')?.setValidators([Validators.required]);
      this.userForm.get('skills')?.setValidators([Validators.required]);
      this.skills.set(this.user.skills);
    } else {
      this.userForm.get('seniority')?.clearValidators();
      this.userForm.get('skills')?.clearValidators();
      this.userForm.get('seniority')?.setValue(null);
      this.userForm.get('skills')?.setValue([]);
      this.skills.set([]);
    }

    this.userForm.get('seniority')?.updateValueAndValidity();
    this.userForm.get('skills')?.updateValueAndValidity();
  }

  isMentor(user: UserMentor | UserEstudante): user is UserMentor {
    return 'skills' in user && 'seniority' in user;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.skills().includes(value)) {
      this.skills.update(skills => {
        const updatedSkills = [...skills, value];
        this.userForm.controls['skills'].setValue(updatedSkills);
        this.userForm.controls['skills'].updateValueAndValidity();
        return updatedSkills;
      });
    }
    this.currentSkill.set('');
  }

  remove(skill: string): void {
    this.skills.update(skills => {
      const updatedSkills = skills.filter(s => s !== skill);
      this.userForm.controls['skills'].setValue(updatedSkills);
      this.userForm.controls['skills'].updateValueAndValidity();
      return updatedSkills;
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;
    if (!this.skills().includes(selectedValue)) {
      this.skills.update(skills => {
        const updatedSkills = [...skills, selectedValue];
        this.userForm.controls['skills'].setValue(updatedSkills);
        this.userForm.controls['skills'].updateValueAndValidity();
        return updatedSkills;
      });
    }
    this.currentSkill.set('');
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.user, ...this.userForm.getRawValue() };

      if (this.isMentor(updatedUser)) {
        updatedUser.skills = this.skills();
      }

      this.userService.updateUser(updatedUser).subscribe(
        () => {
          this.snackBar.open('Dados salvos com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-sucesso'],
          });
          this.refreshUserData();
        },
        () => {
          this.snackBar.open('Erro ao salvar os dados do usuário', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-erro'],
          });
        }
      );
    }
  }

  refreshUserData(): void {
    this.userService.getUserByEmail(this.email).subscribe(
      (data: UserMentor | UserEstudante) => {
        this.user = data;
        this.initializeForm();
      },
      () => {
        this.snackBar.open('Erro ao atualizar os dados do usuário', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-erro'],
        });
      }
    );
  }
}
