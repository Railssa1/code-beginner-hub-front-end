import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TopicoService } from '../services/topic.service';
import { Topic } from '../interfaces/topico.model';
import { UserEstudante, UserMentor } from '../interfaces/user.model';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-topicos',
  templateUrl: './topicos.component.html',
  styleUrls: ['./topicos.component.css'],
  imports: [
    CommonModule,
  ]
})
export class TopicosComponent implements OnInit {
  topicos: Topic[] = [];  // Agora é um array de Topic
  currentPage = 0;
  itemsPerPage = 5;
  user!: UserMentor | UserEstudante;
  email = (localStorage.getItem('usuario') || '').replace(/"/g, '');
  isMentor = false

  constructor(
    private router: Router,
    private topicoService: TopicoService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.carregarTopicos();

    this.userService.getUserByEmail(this.email).subscribe(
      (data: UserMentor | UserEstudante) => {
        this.user = data;
        this.isMentor = this.userService.isMentor(this.user);
        this.carregarTopicos();
      },
      () => {
        this.snackBar.open('Erro ao buscar dados do usuário', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-erro'],
        });
      }
    );
  }

  carregarTopicos(): void {
    if (!this.user) return;

    this.topicoService.getTopicos().subscribe({
      next: (data) => {
        if (this.userService.isMentor(this.user)) {
          const mentor = this.user;
          this.topicos = data.filter(topico =>
            topico.languages.some(lang =>
              mentor.skills.map(skill => skill.toLowerCase()).includes(lang.toLowerCase())
            )
          );
        } else {
          this.topicos = data.filter(topico => topico.author === this.email);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar tópicos:', err);
      }
    });
  }

  get paginatedTopicos(): Topic[] {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.topicos.slice(start, end) || [];
  }

  changePage(direction: 'next' | 'prev') {
    if (direction === 'next' && (this.currentPage + 1) * this.itemsPerPage < this.topicos.length) {
      this.currentPage++;
    } else if (direction === 'prev' && this.currentPage > 0) {
      this.currentPage--;
    }
  }

  onCriarTopico(): void {
    this.router.navigate(['/criar-topico']);
  }


}
