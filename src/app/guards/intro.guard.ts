import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {Router} from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Functions } from '../home/home.page';

@Injectable({
  providedIn: 'root'
})

export class IntroGuard implements CanActivate {  
  functions = new Functions();
  constructor (private router: Router, private storageService: StorageService) {}
  
  async canActivate () {
    const viewData = await this.storageService.get('views');
    console.log(viewData);
    const intro = viewData.filter((view: {name: string}) => view?.name === 'intro');

    if (Array.isArray(intro) && (intro.length > 0)) {
      if (intro[0].visited === false) {
        this.router.navigateByUrl(`/intro`);
        // this.functions.goToView(this.router, 'intro');
        return false;
      }
    }
    return true;
  }
}