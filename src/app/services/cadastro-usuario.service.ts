import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserEstudante, UserMentor } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class CadastroUsuarioService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  createEstudante(estudante: UserEstudante): Observable<UserEstudante> {
    const url = `${this.apiUrl}/criar-usuario-estudante`;
    return this.http.post<UserEstudante>(url, estudante, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  createMentor(mentor: UserMentor): Observable<UserMentor> {
    const url = `${this.apiUrl}/criar-usuario-mentor`;
    return this.http.post<UserMentor>(url, mentor, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
