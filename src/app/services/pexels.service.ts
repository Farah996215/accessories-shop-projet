// src/app/services/pexels.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class PexelsService {
  private apiUrl = 'https://api.pexels.com/v1/search';
  private apiKey = environment.pexelsApiKey; 

  constructor(private http: HttpClient) { }

  searchPhotos(query: string, perPage: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `${this.apiKey}`
    });

    const url = `${this.apiUrl}?query=${query}&per_page=${perPage}`;

    return this.http.get<any>(url, { headers });
  }
}