import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  login(login: Login): Observable<LoginService> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<LoginService>(url, login, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
