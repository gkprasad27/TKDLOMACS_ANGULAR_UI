import { Injectable } from '@angular/core';
import { User } from '../models/common/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public login(userInfo: User) {
    localStorage.setItem('user', JSON.stringify(userInfo));
  }

  public isLoggedIn() {
    return localStorage.getItem('user') !== null;
  }

  public logout() {
    localStorage.removeItem('user');
  }

}
