import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TopicoChat } from '../interfaces/topico.model';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = 'http://localhost:3000/api/'

  getOrCreateChat(mentorId: string, alunoId: string, topicoId: string): Observable<TopicoChat> {
    return this.http.get<TopicoChat>(`${this.apiUrl}chat/messages/${topicoId}`).pipe(
      catchError(() => {
        return this.http.post<TopicoChat>(`${this.apiUrl}chat/create`, { mentorId, alunoId, topicoId });
      })
    );
  }

  createChat(mentorId: number, alunoId: number, topicoId: number): Observable<TopicoChat> {
    return this.http.post<TopicoChat>(`${this.apiUrl}chat/create`, { mentorId, alunoId, topicoId });
  }

  markChatAsRead(chatId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}chat/mark-read`, { chatId, userId });
  }

  concludeTopic(topicoId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}chat/conclude-topic`, { topicoId });
  }

}
