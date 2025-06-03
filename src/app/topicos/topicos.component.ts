import { ChatService } from './../services/chat.service';
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
  imports: [CommonModule]
})
export class TopicosComponent implements OnInit {
  @Input() somenteAtivos = false;

  topicos: Topic[] = [];
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
    private searchService: SearchService,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
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
        this.snackBar.open('Erro ao buscar dados do usuário', 'Fechar', { duration: 3000 });
      }
    );
  }

  carregarTopicos(): void {
    if (!this.user) return;

    this.topicoService.getTopicos().subscribe({
      next: (data) => {
        let filtrados: Topic[] = [];

        if (this.isMentor) {
          const mentor = this.user as UserMentor;
          const habilidades = mentor.skills.map(skill => skill.toLowerCase());

          filtrados = data.filter(topico => {
            if (topico.mentorId) {
              return topico.mentorId === mentor.id;
            }
            return !topico.mentorId && topico.languages.some(lang => habilidades.includes(lang.toLowerCase()));
          });

        } else {
          const estudante = this.user as UserEstudante;
          filtrados = data.filter(topico => topico.studentId === estudante.id);
        }

        if (!this.somenteAtivos) {
          this.topicos = filtrados.filter(t => !t.completed);
        } else {
          this.topicos = filtrados.filter(t => t.completed);
        }

      },
      error: (err) => {
        console.error('Erro ao carregar tópicos:', err);
        this.snackBar.open('Erro ao carregar tópicos', 'Fechar', { duration: 3000 });
      }
    });
  }


  get paginatedTopicos(): Topic[] {
    let filtrados = this.topicos;

    if (this.searchTerm) {
      const termo = this.searchTerm.toLowerCase();
      filtrados = filtrados.filter(t =>
        t.title.toLowerCase().includes(termo) ||
        t.description.toLowerCase().includes(termo) ||
        t.languages.some(lang => lang.toLowerCase().includes(termo))
      );
    }

    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtrados.slice(start, end);
  }

  changePage(direction: 'next' | 'prev'): void {
    if (direction === 'next' && (this.currentPage + 1) * this.itemsPerPage < this.topicos.length) {
      this.currentPage++;
    } else if (direction === 'prev' && this.currentPage > 0) {
      this.currentPage--;
    }
  }

  onCriarTopico(): void {
    this.router.navigate(['/criar-topico']);
  }

  abrirChat(topico: Topic): void {
    const alunoId = topico.studentId;
    const mentorId = this.isMentor ? this.user.id : topico.mentorId;

    if (!alunoId || !mentorId) {
      this.snackBar.open('Dados insuficientes para abrir o chat', 'Fechar', { duration: 3000 });
      return;
    }

    this.chatService.getOrCreateChat(
      mentorId!.toString(),
      alunoId!.toString(),
      topico.id!.toString()
    ).subscribe({
      next: (chat) => {
        this.router.navigate(['/chat', chat.id]);
      },
      error: () => {
        this.snackBar.open('Erro ao abrir o chat', 'Fechar', { duration: 3000 });
      }
    });
  }

  atenderTopico(topico: Topic): void {
    if (!this.user || !this.user.id) return;

    if (typeof topico.mentorId === 'number' && topico.mentorId > -1 && topico.mentorId !== this.user.id) {
      this.snackBar.open('Este tópico já está sendo atendido por outro mentor.', 'Fechar', { duration: 3000 });
      return;
    }

    const alunoId = topico.studentId;
    const mentorId = this.user.id;

    if (!alunoId || !mentorId) {
      this.snackBar.open('Dados insuficientes para abrir o chat', 'Fechar', { duration: 3000 });
      return;
    }

    this.topicoService.updateTopico(topico.id!, { mentorId, inProgress: true }).subscribe({
      next: () => {
        this.chatService.createChat(mentorId, alunoId, topico.id).subscribe({
          next: (chat) => {
            this.snackBar.open('Você está atendendo esse tópico!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/chat', chat.id]);
          },
          error: () => {
            this.snackBar.open('Erro ao criar chat', 'Fechar', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.snackBar.open('Erro ao atualizar o tópico', 'Fechar', { duration: 3000 });
      }
    });
  }

  temRespostaDoMentor(topicoId: number): boolean {
    const mensagensJson = localStorage.getItem(`mensagensChat_${topicoId}`);
    if (!mensagensJson) return false;

    const mensagens = JSON.parse(mensagensJson);

    return mensagens.some((msg: any) => msg.senderType === 'mentor');
  }
}
