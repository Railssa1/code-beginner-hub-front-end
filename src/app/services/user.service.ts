import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserEstudante, UserMentor } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<UserMentor | UserEstudante> {
    return this.http.get<any>(`${this.apiUrl}/recupera-user?email=${email}`);
  }

  deleteUserByEmail(email: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deletar-user?email=${email}`);
  }

  updateUser(user: UserMentor | UserEstudante): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/atualiza-user`, user);
  }

  isMentor(user: UserMentor | UserEstudante): user is UserMentor {
    return 'skills' in user && 'seniority' in user;
  }
}
