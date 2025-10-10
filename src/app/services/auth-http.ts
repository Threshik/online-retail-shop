import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  constructor(private http: HttpClient, private keycloak: KeycloakService) { }

  //get auth headers
  private async getAuthHeaders(): Promise<HttpHeaders> {
    await this.keycloak.updateToken(30);
    const token = await this.keycloak.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // http methods with auth 
  get<T>(url: string, params?: HttpParams): Observable<T> {
    return from(this.getAuthHeaders()).pipe(
      mergeMap(headers => this.http.get<T>(url, { headers, params }))
    );
  }

  post<T>(url: string, body: any, params?: HttpParams): Observable<T> {
    return from(this.getAuthHeaders()).pipe(
      mergeMap(headers => this.http.post<T>(url, body, { headers, params }))
    );
  }

  put<T>(url: string, body: any, params?: HttpParams): Observable<T> {
    return from(this.getAuthHeaders()).pipe(
      mergeMap(headers => this.http.put<T>(url, body, { headers, params }))
    );
  }

  delete<T>(url: string, params?: HttpParams): Observable<T> {
    return from(this.getAuthHeaders()).pipe(
      mergeMap(headers => this.http.delete<T>(url, { headers, params }))
    );
  }
}
