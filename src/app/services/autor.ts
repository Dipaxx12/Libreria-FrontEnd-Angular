import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor } from '../model/autor.model';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private apiUrl = 'http://localhost:8082/api/autores'; // Ajusta si es necesario

  constructor(private http: HttpClient) { }

  findAll(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Autor> {
    return this.http.get<Autor>(`${this.apiUrl}/${id}`);
  }

  save(autor: Autor): Observable<Autor> {
    return this.http.post<Autor>(this.apiUrl, autor);
  }

  update(id: number, autor: Autor): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, autor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
