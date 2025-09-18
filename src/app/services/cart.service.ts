import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../model/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = 'http://localhost:8082/api/guest/cart';
  private readonly CHECKOUT = 'http://localhost:8082/api/guest/checkout';
  private readonly TOKEN_KEY = 'cart_token_v1';

  constructor(private http: HttpClient) {}

  // Genera o lee un token de sesión (invitado)
  private token(): string {
    let t = localStorage.getItem(this.TOKEN_KEY);
    if (!t) {
      // Node/Angular 20 trae crypto disponible en navegador moderno
      t = crypto.randomUUID();
      localStorage.setItem(this.TOKEN_KEY, t);
    }
    return t;
  }

  ensure(): Observable<Cart> {
    return this.http.post<Cart>(`${this.API}?token=${this.token()}`, {});
  }

  get(): Observable<Cart> {
    return this.http.get<Cart>(`${this.API}?token=${this.token()}`);
  }

  addItem(libroId: number, cantidad = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.API}/items?token=${this.token()}`, { libroId, cantidad });
  }

  updateItem(carritoItemId: number, cantidad: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.API}/items/${carritoItemId}?token=${this.token()}`, { cantidad });
  }

  removeItem(carritoItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/items/${carritoItemId}?token=${this.token()}`);
  }

  clear(): Observable<void> {
    return this.http.delete<void>(`${this.API}/clear?token=${this.token()}`);
  }

  checkout(): Observable<any> {
    return this.http.post<any>(`${this.CHECKOUT}?token=${this.token()}`, {});
  }
}
