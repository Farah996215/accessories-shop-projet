import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  private storeUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private removeStoredUser(): void {
    localStorage.removeItem('currentUser');
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login.php`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.storeUser(response.user);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register.php`, { name, email, password })
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.storeUser(response.user);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    this.removeStoredUser();
    this.currentUserSubject.next(null);
  }

  setUser(user: User): void {
    this.storeUser(user);
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getUserId(): number | null {
    return this.currentUserSubject.value?.id || null;
  }
}