import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/api/user`
  private readonly useMock = environment.useMock;
  private USER_ID = '';

  get userId() {
    return this.USER_ID;
  }

  constructor(private http: HttpClient) { }

  setUserId(id: string) {
    this.USER_ID = id;
  }

  loginByEmail(email: string) {
    if (environment.useMock) {
      return of({
        userId: '01717B1B-F470-44C4-A7C6-DDED938611F3'
      }).pipe(delay(800))
    }

    const url = `${this.apiUrl}/login`;
    return this.http.get(url, {
      headers: { email }
    });
  }

}
