import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute } from '@angular/router';
import { TopicoService } from '../services/topic.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-chat-concluido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-concluido.component.html',
  styleUrls: ['./chat-concluido.component.css']
})
export class ChatConcluidoComponent implements OnInit {
  topico: any;
  mensagens: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private topicoService: TopicoService,
    private router: Router
  ) {}

  nomeAluno: string = '';
  nomeMentor: string = '';

  ngOnInit(): void {
    const topicId = Number(this.route.snapshot.paramMap.get('id'));
    if (topicId) {
      this.topicoService.getTopicoConcluidoPorId(topicId).subscribe((data) => {
        this.topico = data;
        this.mensagens = data.messages;

        const aluno = this.mensagens.find(msg => msg.senderType === 'student');
        const mentor = this.mensagens.find(msg => msg.senderType === 'mentor');

        this.nomeAluno = aluno?.senderName.trim() || '';
        this.nomeMentor = mentor?.senderName.trim() || '';
      });
    }
  }


  formatHora(dataISO: string): string {
    const data = new Date(dataISO);
    // Formatar para hh:mm, ex: 22:19
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }


}
