import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login, LoginResponse } from '../interfaces/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  login(login: Login): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<LoginResponse>(url, login, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
