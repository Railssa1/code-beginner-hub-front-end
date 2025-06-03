import { Injectable } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable();

  private isConnected = false;
  private topicId!: number;
  private username!: string;

  connect(topicId: number, username: string) {
    if (this.isConnected) {
      console.warn('WebSocket já conectado');
      return;
    }

    this.topicId = topicId;
    this.username = username;

    this.socket = new WebSocket(`ws://localhost:3000`);

    this.socket.onopen = () => {
      console.log('WebSocket conectado');
      this.isConnected = true;

      const joinMessage = {
        type: 'join',
        username: this.username,
        topicId: this.topicId
      };
      this.send(joinMessage);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messagesSubject.next(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.warn('WebSocket desconectado. Tentando reconectar em 3 segundos...');
      this.isConnected = false;
      this.reconnect();
    };
  }

  private reconnect() {
    timer(3000).subscribe(() => {
      console.log('Tentando reconectar...');
      this.connect(this.topicId, this.username);
    });
  }

  send(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket não está aberto. Mensagem não enviada:', message);
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
    this.isConnected = false;
  }
}
