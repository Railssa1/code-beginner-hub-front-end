import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserEstudante, UserMentor } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  // Método para criar um novo User_Estudante
  createUserEstudante(userData: { email: string, password: string, name: string }): Observable<UserEstudante> {
    return this.http.post<UserEstudante>(`${this.apiUrl}/estudante`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Método para criar um novo User_Mentor
  createUserMentor(userData: { email: string, password: string, name: string, skills: string[], seniority: string }): Observable<UserMentor> {
    return this.http.post<UserMentor>(`${this.apiUrl}/mentor`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Método para buscar um usuário pelo e-mail (para login, por exemplo)
  getUserByEmail(email: string): Observable<UserMentor> {
    return this.http.get<UserMentor>(`${this.apiUrl}/user/${email}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
