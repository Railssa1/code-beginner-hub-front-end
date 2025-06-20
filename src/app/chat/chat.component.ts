import { NgFor, CommonModule, NgIf } from "@angular/common";
import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { WebSocketService } from "../services/web-socket.service";
import { TopicoService } from "../services/topic.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserEstudante, UserMentor } from '../interfaces/user.model';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ModaConfirmacaoComponent } from "../_components/moda-confirmacao/moda-confirmacao.component";
import { MatButtonModule } from "@angular/material/button";

export interface Mensagem {
  author: string;
  text: string;
  topicId: number;
  createdAt: Date;
  senderEmail: string;
  senderType: string
}

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    CommonModule,
    NgIf,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [WebSocketService]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  public meuEmail = '';
  public topicoId = 0;
  public mensagemDigitada = '';
  public mensagens: Mensagem[] = [];
  public topicoConcluido = false;
  public souEstudante = false;

  user!: UserMentor | UserEstudante;
  email = (localStorage.getItem('usuario') || '').replace(/"/g, '');
  isMentor = false;
  searchTerm = '';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private wsService: WebSocketService,
    private cdr: ChangeDetectorRef,
    private topicoService: TopicoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.inicializarDados();
    this.verificarStatusTopico();
    this.conectarWebSocket();

    this.userService.getUserByEmail(this.email).subscribe(
      (data: UserMentor | UserEstudante) => {
        this.user = data;
        this.isMentor = this.userService.isMentor(this.user);
        this.souEstudante = !this.isMentor; // define quem é o usuário
      },
      () => {
        this.snackBar.open('Erro ao buscar dados do usuário', 'Fechar', { duration: 3000 });
      }
    );

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

  private verificarStatusTopico() {
    this.topicoService.getTopicoById(this.topicoId).subscribe({
      next: (topico) => {
        this.topicoConcluido = topico.completed;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar o tópico', 'Fechar', { duration: 3000 });
        this.router.navigate(['/topicos']);
      }
    });
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
        senderEmail: msg.senderEmail || '',
        senderType: msg.senderType
      };

      this.mensagens.push(novaMensagem);
      this.salvarMensagensLocalmente();
      this.cdr.detectChanges();
    }
  }

  public enviarMensagem() {
    if (this.topicoConcluido) {
      this.snackBar.open('Este tópico está concluído. Não é possível enviar mensagens.', 'Fechar', { duration: 3000 });
      return;
    }

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

  public concluirTopico(isPublish: boolean) {
    this.topicoService.updateTopico(this.topicoId, {
      completed: true,
      inProgress: false,
      chatConcluded: true,
      isPublish: isPublish ? isPublish : false
    }).subscribe({
      next: () => {
        this.snackBar.open('Tópico concluído com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/topicos-concluidos']);
      },
      error: () => {
        this.snackBar.open('Erro ao concluir chat', 'Fechar', { duration: 3000 });
        this.router.navigate(['/topicos']);
      }
    });
  }

  ngOnDestroy() {
    this.wsService.close();
  }

  openModal() {
    const dialogRef = this.dialog.open(ModaConfirmacaoComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((resposta: boolean) => {
      this.concluirTopico(resposta);
    });
  }
}
