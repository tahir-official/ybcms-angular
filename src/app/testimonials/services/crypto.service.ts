import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private apiUrl = 'https://yb-api.wethreeinfotech.com/api.php';
  private userName = 'saral33';

  // SAME KEY AS PHP
  private AES_KEY = 'mySuperSecretKey1234567890abcdef';

  constructor(private http: HttpClient) {}

  /**
   * ENCRYPT
   */
  async encrypt(payload: any): Promise<any> {

    const url = `${this.apiUrl}?action=encryptdata`;

    const body = {
      data: payload,
      userName: this.userName
    };

    const response = await firstValueFrom(
      this.http.post(url, body, {
        observe: 'response',
        responseType: 'text'
      })
    );

    return {
      status: response.status,
      body: response.body
    };
  }

  /**
   * DECRYPT
   */
  async decrypt(encryptedText: string): Promise<any> {

    const url = `${this.apiUrl}?action=decryptdata`;

    const body = {
      data: encryptedText,
      userName: this.userName
    };

    const response = await firstValueFrom(
      this.http.post(url, body, {
        observe: 'response'
      })
    );

    return {
      status: response.status,
      body: response.body
    };
  }

  // =====================================================
  // LOCAL AES-256 ENCRYPT (same as PHP encrypt_r)
  // =====================================================
  encrypt_replace(data: any) {

    try {

      const jsonData = JSON.stringify(data);

      // 16 byte IV
      const iv = CryptoJS.lib.WordArray.random(16);

      const key = CryptoJS.enc.Utf8.parse(this.AES_KEY);

      const encrypted = CryptoJS.AES.encrypt(
        jsonData,
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      // Convert ciphertext to WordArray
      const cipherBytes = CryptoJS.enc.Base64.parse(encrypted.toString());

      // Combine IV + ciphertext
      const combined = iv.clone().concat(cipherBytes);

      return {
        status: 200,
        body: CryptoJS.enc.Base64.stringify(combined)
      };

    } catch (error) {

      return {
        status: 500,
        body: error
      };
    }
  }

  // =====================================================
  // LOCAL AES-256 DECRYPT (same as PHP decrypt_r)
  // =====================================================
  decrypt_replace(encryptedData: string) {

    try {

      const raw = CryptoJS.enc.Base64.parse(encryptedData);

      // Extract IV (first 16 bytes)
      const iv = CryptoJS.lib.WordArray.create(
        raw.words.slice(0, 4),
        16
      );

      // Extract ciphertext
      const cipher = CryptoJS.lib.WordArray.create(
        raw.words.slice(4),
        raw.sigBytes - 16
      );

      const key = CryptoJS.enc.Utf8.parse(this.AES_KEY);

      const decrypted = CryptoJS.AES.decrypt(
        {
          ciphertext: cipher
        } as any,
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      return {
        status: 200,
        body: JSON.parse(decryptedText)
      };

    } catch (error) {

      return {
        status: 500,
        body: error
      };
    }
  }


}

