import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic, TopicoChat } from '../interfaces/topico.model';
import { Mensagem } from '../chat/chat.component';

@Injectable({
  providedIn: 'root'
})
export class TopicoService {
  private apiUrl = 'http://localhost:3000/api/topics';

  constructor(private http: HttpClient) { }

  createTopico(topicoData: TopicoChat): Observable<TopicoChat> {
    return this.http.post<TopicoChat>(`${this.apiUrl}/create-topic`, topicoData);
  }

  getTopicos(): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.apiUrl);
  }

  vincularMentor(topicId: number, mentorId: number): Observable<Topic> {
    return this.http.patch<Topic>(`${this.apiUrl}/vincular-mentor/${topicId}`, { mentorId });
  }

  updateTopico(topicId: number, updateData: Partial<Topic>): Observable<Topic> {
    return this.http.patch<Topic>(`${this.apiUrl}/${topicId}`, updateData);
  }

  getTopicoById(topicId: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiUrl}/${topicId}`);
  }

  getMensagensPorTopico(topicId: number): Observable<Mensagem[]> {
    return this.http.get<Mensagem[]>(`http://localhost:3000/api/chat/mensagens/${topicId}`);
  }

  getTopicoConcluidoPorId(topicId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/completed/${topicId}`);
  }
}
