import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topicos',
  standalone: true,
  imports: [NgFor],
  templateUrl: './topicos.component.html',
  styleUrls: ['./topicos.component.css']
})
export class TopicosComponent {
  topicos = [
    { titulo: 'Java', descricao: 'Estou com problema em criar uma classe', autor: 'adrilucy' },
    { titulo: 'Python', descricao: 'Estou com problema em criar uma função', autor: 'adrilucy' },
    { titulo: 'C#', descricao: 'Estou com problema em um determinado código', autor: 'adrilucy' },
    { titulo: 'HTML', descricao: 'Não consigo criar uma tabela dentro de uma pagina', autor: 'adrilucy' },
    { titulo: 'aaa', descricao: 'Estou com problema em criar uma classe', autor: 'adrilucy' },
    { titulo: 'bb', descricao: 'Estou com problema em criar uma função', autor: 'adrilucy' },
    { titulo: 'ccc#', descricao: 'Estou com problema em um determinado código', autor: 'adrilucy' },
    { titulo: 'ddd', descricao: 'Não consigo criar uma tabela dentro de uma pagina', autor: 'adrilucy' },
    { titulo: 'HTML', descricao: 'Não consigo criar uma tabela dentro de uma pagina', autor: 'adrilucy' },
    { titulo: 'aaa', descricao: 'Estou com problema em criar uma classe', autor: 'adrilucy' },
    { titulo: 'bb', descricao: 'Estou com problema em criar uma função', autor: 'adrilucy' },
    { titulo: 'ccc#', descricao: 'Estou com problema em um determinado código', autor: 'adrilucy' },
    { titulo: 'ddd', descricao: 'Não consigo criar uma tabela dentro de uma pagina', autor: 'adrilucy' }
  ];

  constructor(private router: Router) { }

  // Método para redirecionar
  onCriarTopico(): void {
    this.router.navigate(['/criar-topico']);
  }

  currentPage = 0;
  itemsPerPage = 5;

  get paginatedTopicos() {
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
}
