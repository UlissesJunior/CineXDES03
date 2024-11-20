import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatorService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  signUp(user: { username: string; email: string; password: string; photo: string | null }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, user);
  }  

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, { params: { email } });
  }  
}