import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  urlServer = 'https://music.fly.dev';
  constructor() {

  }

  async registerUser(userData: {email: any, password: any, name: any, userName: any}) {
    return await fetch(`${this.urlServer}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user": {
          "email": userData.email,
          "password": userData.password,
          "name": userData.name,
          "username": userData.userName
        }
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  async loginUser(userData: {email: any, password: any}) {
    return await fetch(`${this.urlServer}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user": {
          "email": userData.email,
          "password": userData.password,
        }
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }
}
