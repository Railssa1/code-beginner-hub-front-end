import { UserEstudante, UserMentor } from './../interfaces/user.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { signal, computed } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TopicoService } from '../services/topic.service';
import { NgIf, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-criar-topico',
  templateUrl: './criar-topico.component.html',
  styleUrls: ['./criar-topico.component.css'],
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
export class CriarTopicoComponent implements OnInit {
  topicoForm!: FormGroup;
  email = (localStorage.getItem('usuario') || '').replace(/"/g, '');

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly linguagens = signal<string[]>([]);
  readonly todasLinguagens: string[] = ['Java', 'Python', 'HTML', 'CSS', 'JavaScript', 'C#', 'C++', 'Ruby'];
  readonly linguagensFiltradas = computed(() => {
    const input = this.topicoForm.get('linguagensInput')?.value?.toLowerCase() || '';
    return input ? this.todasLinguagens.filter(lang => lang.toLowerCase().includes(input)) : this.todasLinguagens.slice();
  });

  constructor(
    private fb: FormBuilder,
    private topicoService: TopicoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.topicoForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      languages: [[], [Validators.required]],
      linguagensInput: [''],
      author: [this.email]
    });
  }

  addLinguagem(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.linguagens().includes(value)) {
      this.linguagens.update(langs => {
        const updated = [...langs, value];
        this.topicoForm.controls['languages'].setValue(updated);
        this.topicoForm.controls['languages'].updateValueAndValidity();
        return updated;
      });
    }
    this.topicoForm.controls['linguagensInput'].setValue('');
  }

  removeLinguagem(linguagem: string): void {
    this.linguagens.update(langs => {
      const updated = langs.filter(lang => lang !== linguagem);
      this.topicoForm.controls['languages'].setValue(updated);
      this.topicoForm.controls['languages'].updateValueAndValidity();
      return updated;
    });
  }

  selectedLinguagem(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (!this.linguagens().includes(value)) {
      this.linguagens.update(langs => {
        const updated = [...langs, value];
        this.topicoForm.controls['languages'].setValue(updated);
        this.topicoForm.controls['languages'].updateValueAndValidity();
        return updated;
      });
    }
    this.topicoForm.controls['linguagensInput'].setValue('');
  }

  onSubmit(): void {
    if (this.topicoForm.invalid) {
      this.topicoForm.markAllAsTouched();
      return;
    }

    const topicoData = this.topicoForm.value;
    this.topicoService.createTopico(topicoData).subscribe(
      () => {
        this.snackBar.open('Tópico criado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-sucesso']
        });
        this.topicoForm.reset();
        this.linguagens.set([]);
        this.router.navigate(['/topicos']);
      },
      () => {
        this.snackBar.open('Erro ao criar tópico. Tente novamente.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-erro']
        });
      }
    );
  }
}
