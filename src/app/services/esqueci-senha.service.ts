import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EsqueciSenha, RedefinirSenha } from '../interfaces/login.model';

@Injectable({
  providedIn: 'root'
})
export class EsqueciSenhaService {
  private apiUrl: string = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  sendResetLink(email: string): Observable<void> {
    const url: string = `${this.apiUrl}/esqueci-senha`;
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body: EsqueciSenha = { email: email };

    return this.http.post<void>(url, body, { headers: headers });
  }

  resetPassword(email: string, newPassword: string): Observable<void> {
    const url: string = `${this.apiUrl}/reset-senha`;
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body: RedefinirSenha = { email: email, newPassword: newPassword };

    return this.http.post<void>(url, body, { headers: headers });
  }
}
