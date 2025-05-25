import {
  NgFor,
  NgIf,
  CommonModule
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';

interface Mensagem {
  author: string;
  text: string;
  topicId: number;
  createdAt: Date;
}

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule],
  providers: [WebSocketService]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  public meuUsuario = '';
  public topicoId = 0;
  public mensagem = '';

  public mensagens: Mensagem[] = [];
  public usuarios: string[] = [];

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wsService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id');
    this.topicoId = Number(chatId);
    this.meuUsuario = (localStorage.getItem('usuario') || '').replace(/"/g, '');

    const mensagensSalvasJSON = localStorage.getItem(`mensagensChat_${this.topicoId}`);
    if (mensagensSalvasJSON) {
      this.mensagens = JSON.parse(mensagensSalvasJSON).map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt)
      }));
    }

    this.wsService.connect(this.topicoId, this.meuUsuario);

    this.wsService.messages$.subscribe((msg) => {
      if (msg.type === 'message' && msg.topicId === this.topicoId) {
        this.mensagens.push({
          author: msg.author,
          text: msg.text,
          topicId: msg.topicId,
          createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date()
        });

        localStorage.setItem(`mensagensChat_${this.topicoId}`, JSON.stringify(this.mensagens));

        this.cdr.detectChanges();
      }

      if (msg.type === 'users') {
        this.usuarios = msg.users;
        this.cdr.detectChanges();
      }
    });
  }

  public enviarMensagem() {
    if (!this.mensagem.trim()) return;

    const message = {
      type: 'message',
      topicId: this.topicoId,
      text: this.mensagem,
    };

    this.wsService.send(message);
    this.mensagem = '';
    this.cdr.detectChanges();
  }

  public get mensagensFiltradas() {
    return this.mensagens.filter(m => m.topicId === this.topicoId);
  }

  public get outroUsuario() {
    return this.usuarios.find(u => u !== this.meuUsuario) || 'Aguardando usuário';
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnDestroy() {
    this.wsService.close();
  }
}
