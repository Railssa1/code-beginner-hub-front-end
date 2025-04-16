import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../interfaces/topico.model';

@Injectable({
  providedIn: 'root'
})
export class TopicoService {
  private apiUrl = 'http://localhost:3000/api/topics';  // Certifique-se de que a URL está correta

  constructor(private http: HttpClient) {}

  createTopico(topicoData: Topic): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-topic`, topicoData);
  }

  getTopicos(): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.apiUrl);
  }
}
