import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'https://pa-nodejs.onrender.com/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  insertProduct(item: Product): Observable<Product> {
    const headers = { 'Content-Type': 'application/json' };
    console.log('Inserting item:', item);
    return this.http.post<Product>(`${this.apiUrl}/product`, item, { headers });
  }

  updateProduct(id: string, item: Product): Observable<Product> {
    const headers = { 'Content-Type': 'application/json' };
    console.log('Update item:', item);

    return this.http.put<Product>(`${this.apiUrl}/product/${id}`, item, {
      headers,
    });
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product/${id}`);
  }
}
