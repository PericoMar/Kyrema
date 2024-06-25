import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_KEY = 'currentUser';


  getCurrentUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('token');
  }
}

