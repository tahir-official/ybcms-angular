import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CryptoService } from './crypto.service';
import { Testimonial } from '../models/testimonial.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {

  private bearerToken = 'e34580c86c22c63db50dd0dad9b95712';
  private userName = 'saral33'; // sent in JSON body

  constructor(private http: HttpClient, private crypto: CryptoService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.bearerToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  // ---------------------------------------------------------
  // FETCH CATEGORIES
  // ---------------------------------------------------------
  async fetchCategories(langcode: string = 'en'): Promise<Category[]> {
    const payload = { langcode };

    const encryptedPayload = await this.crypto.encrypt(payload);

    // JSON body should match PHP request
    const body = {
      data: encryptedPayload.body,
      userName: this.userName
    };

    const response: any = await this.http.post(
      'https://dev-ybcms.pantheonsite.io/api/testimonial-categories',
      body,
      { headers: this.getHeaders() }
    ).toPromise();

    if (response?.data) {
      const decrypted = await this.crypto.decrypt(response.data);
      return decrypted.body;
    }

    return [];
  }

  // ---------------------------------------------------------
  // FETCH TESTIMONIALS
  // ---------------------------------------------------------
  async fetchTestimonials(langcode: string = 'en', category: string = ''): Promise<Testimonial[]> {
    const payload: any = { langcode };

    if (category) payload.category = category;
    payload.show_on_home = null;

    const encryptedPayload = await this.crypto.encrypt(payload);

    // JSON body exactly as PHP format
    const body = {
      data: encryptedPayload.body,
      userName: this.userName
    };

    const response: any = await this.http.post(
      'https://dev-ybcms.pantheonsite.io/api/testimonials',
      body,
      { headers: this.getHeaders() }
    ).toPromise();

    if (response?.data) {
      const decrypted = await this.crypto.decrypt(response.data);
       return decrypted.body;
    }

    return [];
  }
}
