import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StorageService } from '../services/storage.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {
  constructor (private storageService: StorageService, private router: Router) {

  }
  async canActivate() {
    const userSessionInfo = await this.storageService.get('userSession');
    if ((!userSessionInfo) || (typeof userSessionInfo !== 'object')) {
      this.router.navigateByUrl(`/login`);
      return false
    }
    const loggedInValidation = userSessionInfo.loggedIn ?? false;
    if (!loggedInValidation) {
      this.router.navigateByUrl(`/login`);
      return false
    }

    return true;
  }
} 