import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private messagesSubject = new Subject<any>();

  public messages$ = this.messagesSubject.asObservable();

  connect(topicId: number, username: string) {
    this.socket = new WebSocket(`ws://localhost:3000`);

    this.socket.onopen = () => {
      const joinMessage = {
        type: 'join',
        username,
        topicId
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
      console.log('WebSocket connection closed');
    };
  }

  send(message: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
