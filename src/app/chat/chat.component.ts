import { NgFor, CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { WebSocketService } from "../services/web-socket.service";

export interface Mensagem {
  author: string;
  text: string;
  topicId: number;
  createdAt: Date;
  senderEmail: string;
}

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  providers: [WebSocketService]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  public meuEmail = '';
  public topicoId = 0;
  public mensagemDigitada = '';

  public mensagens: Mensagem[] = [];

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private wsService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.inicializarDados();
    this.conectarWebSocket();
  }

  private inicializarDados() {
    const chatId = this.route.snapshot.paramMap.get('id');
    this.topicoId = Number(chatId);

    this.meuEmail = (localStorage.getItem('usuario') || '').replace(/"/g, '').trim();

    const mensagensSalvas = localStorage.getItem(`mensagensChat_${this.topicoId}`);
    if (mensagensSalvas) {
      this.mensagens = JSON.parse(mensagensSalvas).map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt)
      }));
    }
  }

  private conectarWebSocket() {
    this.wsService.connect(this.topicoId, this.meuEmail);

    this.wsService.messages$.subscribe((msg) => {
      if (msg.topicId !== this.topicoId) return;

      if (msg.type === 'message') {
        this.receberMensagem(msg);
      }
    });
  }

  private receberMensagem(msg: any) {
    const autor = msg.senderName || msg.author || 'Desconhecido';
    const texto = msg.message || msg.text || '';

    if (texto.trim()) {
      const novaMensagem: Mensagem = {
        author: autor,
        text: texto,
        topicId: msg.topicId,
        createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
        senderEmail: msg.senderEmail || ''
      };

      this.mensagens.push(novaMensagem);
      this.salvarMensagensLocalmente();
      this.cdr.detectChanges();
    }
  }

  public enviarMensagem() {
    if (!this.mensagemDigitada.trim()) return;

    const message = {
      type: 'message',
      topicId: this.topicoId,
      text: this.mensagemDigitada,
      senderEmail: this.meuEmail
    };

    this.wsService.send(message);
    this.mensagemDigitada = '';
    this.cdr.detectChanges();
  }

  public get mensagensFiltradas() {
    return this.mensagens.filter(m => m.topicId === this.topicoId);
  }

  public get nomeOutroUsuario(): string {
    const meuEmailNormalizado = (this.meuEmail || '').trim().toLowerCase();

    for (const msg of this.mensagens) {
      const rawEmail = msg.senderEmail;
      const emailMsg = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

      if (emailMsg && emailMsg !== meuEmailNormalizado) {
        return msg.author || emailMsg || 'Outro usuário';
      }
    }
    return 'Aguardando usuário';
  }

  private salvarMensagensLocalmente() {
    localStorage.setItem(`mensagensChat_${this.topicoId}`, JSON.stringify(this.mensagens));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erro ao rolar para baixo:', err);
    }
  }

  concluirChat(){}

  ngOnDestroy() {
    this.wsService.close();
  }
}
