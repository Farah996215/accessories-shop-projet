import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';

export interface AIResponse {
  products: Product[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiUrl = 'http://localhost/api';

  constructor(private http: HttpClient) {}

  getProductSuggestions(query: string): Observable<AIResponse> {
    return this.http.post<AIResponse>(`${this.apiUrl}/ai-assistant.php`, { query });
  }
}