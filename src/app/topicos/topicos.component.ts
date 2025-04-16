import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TopicoService } from '../services/topic.service';
import { Topic } from '../interfaces/topico.model';

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

  constructor(
    private router: Router,
    private topicoService: TopicoService
  ) {}

  ngOnInit(): void {
    this.carregarTopicos();
  }

  carregarTopicos(): void {
    this.topicoService.getTopicos().subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.topicos = data;
      },
      error: (err) => {
        console.error('Erro ao carregar tópicos:', err);
      }
    });
  }

  get paginatedTopicos(): Topic[] {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.topicos.slice(start, end);
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
