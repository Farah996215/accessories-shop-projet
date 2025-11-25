import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  private googleAIKey = 'AIzaSyCkrNR5YfyWvp7B9yduynKBjVyWoUNH6Ss'

  constructor(private http: HttpClient) {}

  getProductSuggestions(query: string): Observable<AIResponse> {
    return this.http.post<AIResponse>(`${this.apiUrl}/ai-assistant.php`, { query })
      .pipe(
        catchError(error => {
          console.error('AI API error, using fallback:', error);
          return this.getFallbackSuggestions(query);
        })
      );
  }

  private getFallbackSuggestions(query: string): Observable<AIResponse> {
    const lowerQuery = query.toLowerCase();
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Silver Diamond Necklace',
        price: 45,
        description: 'Elegant silver necklace with genuine diamond pendant',
        image: 'assets/necklace.jpg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 2,
        name: 'Gold Plated Bracelet',
        price: 75,
        description: 'Beautiful gold plated bracelet with intricate design',
        image: 'assets/bracelet.jpg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 5,
        name: 'Silver Chain Necklace',
        price: 28,
        description: 'Simple and elegant silver chain necklace',
        image: 'assets/necklace2.jpg',
        category: 'necklaces',
        inStock: true
      }
    ];

    const filteredProducts = mockProducts.filter(product => {
      if (lowerQuery.includes('necklace') && product.category === 'necklaces') return true;
      if (lowerQuery.includes('bracelet') && product.category === 'bracelets') return true;
      if (lowerQuery.includes('earring') && product.category === 'earrings') return true;
      if (lowerQuery.includes('watch') && product.category === 'watches') return true;
      if (lowerQuery.includes('ring') && product.category === 'rings') return true;
      
      if (lowerQuery.includes('under') && lowerQuery.includes('50')) {
        return product.price < 50;
      }
      if (lowerQuery.includes('under') && lowerQuery.includes('100')) {
        return product.price < 100;
      }
      
      if (lowerQuery.includes('silver')) {
        return product.name.toLowerCase().includes('silver');
      }
      if (lowerQuery.includes('gold')) {
        return product.name.toLowerCase().includes('gold');
      }
      
      return false;
    });

    const response: AIResponse = {
      products: filteredProducts,
      message: `I found ${filteredProducts.length} products matching: "${query}"`
    };

    return of(response);
  }

  // Method to integrate with Google Gemini API (for future implementation)
  private callGoogleAI(query: string): Observable<AIResponse> {
    return of({
      products: [],
      message: 'Google AI integration coming soon!'
    });
  }
}