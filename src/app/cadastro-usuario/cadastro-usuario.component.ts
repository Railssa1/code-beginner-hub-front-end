import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css'],
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule, NgIf],
})

export class CadastroUsuarioComponent implements OnInit {
  cadastroForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.cadastroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      seniority: ['', [Validators.required]],
      skills: ['', [Validators.required]],
      name: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentSkill = model('');
  readonly skills = signal(['Full-Stack']);
  readonly allSkills: string[] = ['Front-End', 'Back-End', 'Segurança da informação', 'Banco de dados', 'Arquitetura', 'Cloud'];
  readonly filteredSkills = computed(() => {
    const currentFruit = this.currentSkill().toLowerCase();
    return currentFruit
      ? this.allSkills.filter(skill => skill.toLowerCase().includes(currentFruit))
      : this.allSkills.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  tipoUsuario = "";
  selectedSeniority: string = '';

  ngOnInit() {
    this.getTipoUsuario()
  }

  getTipoUsuario() {
    this.tipoUsuario = this.route.snapshot.queryParams["tipo"];
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
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

    console.log('Cadastro realizado!', this.cadastroForm.value);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    const currentSkills = this.skills();
    if (value && !currentSkills.includes(value)) {
      this.skills.update(skills => [...skills, value]);
    }

    this.currentSkill.set('');
  }

  remove(skill: string): void {
    this.skills.update(skills => {
      const index = skills.indexOf(skill);
      if (index < 0) {
        return skills;
      }

      skills.splice(index, 1);
      this.announcer.announce(`Removed ${skill}`);

      this.cadastroForm.controls['habilidades'].setValue([...skills]);
      this.cadastroForm.controls['habilidades'].updateValueAndValidity();

      return [...skills];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.viewValue;

    if (!this.skills().includes(selectedValue)) {
      this.skills.update(skills => {
        const updatedSkills = [...skills, selectedValue];

        this.cadastroForm.controls['habilidades'].setValue(updatedSkills);
        this.cadastroForm.controls['habilidades'].updateValueAndValidity();

        return updatedSkills;
      });
    }

    this.currentSkill.set('');
    event.option.deselect();
  }

}
