import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {Router} from '@angular/router';
import { StorageService } from '../services/storage.service';
import { RoutesNavigation } from '../home/home.page';

@Injectable({
  providedIn: 'root'
})

export class IntroGuard implements CanActivate {  
  functions: RoutesNavigation
  constructor (private router: Router, private storageService: StorageService) {
    this.functions = new RoutesNavigation(router)
  }
  
  async canActivate () {
    const viewData = await this.storageService.get('views');
    if (!viewData) {
      this.functions.goToView(`/intro`);
      return false;
    }
    const intro = viewData.filter((view: {name: string}) => view?.name === 'intro');

    if (Array.isArray(intro) && (intro.length > 0)) {
      if (intro[0].visited === false) {
        this.functions.goToView(`/intro`);
        // this.functions.goToView(this.router, 'intro');
        return false;
      }
    }
    return true;
  }
}