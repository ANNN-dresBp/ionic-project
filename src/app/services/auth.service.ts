import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  loginUser(credentials: any) {
    return new Promise((accept, reject) => {
      if (credentials.email == "andres@gmail.com" && credentials.password == "123456789") {
        accept('Login Correcto');
      } else {
        reject('Login Incorrecto')
      }
    })
  }

  registerUser(credentials: any) {
    return new Promise((accept, reject) => {
      if (credentials.name && credentials.lastName && credentials.email && credentials.password) {
        accept('Usuario creado exitosamente');
      } else {
        reject('No se pudo crear el usuario');
      }
    })
  }
}
