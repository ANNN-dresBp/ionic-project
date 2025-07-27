import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {Router} from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ColorTheme } from '../home/home.page'

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntroPage implements OnInit {

  introData = {
    img: ''
  }
  // theme: ColorTheme;
  introBgColor = 'var(--light-color)';
  introTextColor = 'var(--dark-color)';
  constructor(private router: Router, private storageService: StorageService) { 
    // this.theme = new ColorTheme(this.storageService);
  }

  async ngOnInit() {
    // await this.theme.loadStorageData();
    document.documentElement.style.setProperty('--ion-background-color', this.introBgColor);
    document.documentElement.style.setProperty('--ion-text-color', this.introTextColor);
  }

  async goBack () {
    await this.storageService.set('views', [{name: 'intro', visited: true}]);
    this.router.navigateByUrl('menu/home');
  }

}
