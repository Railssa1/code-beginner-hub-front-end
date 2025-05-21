import { SearchService } from './../services/search.service';
import { Component, Input, OnInit } from '@angular/core';
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
  @Input() somenteAtivos = false;
  topicos: Topic[] = [];  // Agora é um array de Topic
  currentPage = 0;
  itemsPerPage = 5;
  user!: UserMentor | UserEstudante;
  email = (localStorage.getItem('usuario') || '').replace(/"/g, '');
  isMentor = false;
  searchTerm = '';

  constructor(
    private router: Router,
    private topicoService: TopicoService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.carregarTopicos();
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 0;
    });

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
        let filtrados: Topic[] = [];

        if (this.userService.isMentor(this.user)) {
          const mentor = this.user;
          filtrados = data.filter(topico =>
            topico.languages.some(lang =>
              mentor.skills.map(skill => skill.toLowerCase()).includes(lang.toLowerCase())
            )
          );
        } else {
          filtrados = data.filter(topico => topico.author === this.email);
        }

        this.topicos = this.somenteAtivos
          ? filtrados.filter(t => t.completed)
          : filtrados.filter(t => !t.completed);
      },
      error: (err) => {
        console.error('Erro ao carregar tópicos:', err);
      }
    });
  }

  get paginatedTopicos(): Topic[] {
    let filtrados = this.topicos;
    if (this.searchTerm) {
      filtrados = filtrados.filter(t =>
        t.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.languages.some(lang => lang.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtrados.slice(start, end) || [];
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

  atenderTopico(topico: Topic): void {
    this.router.navigate(['/atender-topico', topico.id]);
  }

}
