import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, MenuController} from '@ionic/angular/standalone';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  // imports: [IonHeader, IonToolbar, IonTitle, IonContent],
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  // headerContainer = document.querySelector('ionic-header');
  lightColor = 'var(--light-color)';
  darkColor = 'var(--dark-color)';
  lighterDarkColor = 'var(--lighter-dark-color)'; 
  actualColor = this.darkColor;
  textColor = this.lightColor;
  toolbarColor = this.lighterDarkColor;

  genres = [
    {
      title: "Wu-Tang Clan",
      image: "https://m.media-amazon.com/images/S/pv-target-images/489efd72a1886f9387d9c415d691d61195a0d42b438ff779c22f4c90de17b61e._SX1080_FMjpg_.jpg",
      description: "Wu-Tang Clan es un grupo estadounidense de rap originario de Staten Island, Nueva York. El grupo está formado por nueve MC's. Todos sus miembros han lanzado álbumes solistas, y el grupo ha producido diferentes grupos y solistas."
    },
    {
      title: "Música 2",
      image: "https://m.media-amazon.com/images/S/pv-target-images/489efd72a1886f9387d9c415d691d61195a0d42b438ff779c22f4c90de17b61e._SX1080_FMjpg_.jpg",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit aliquid adipisci, officia doloribus ea iure ipsam praesentium sit earum molestiae dolorum, maxime, quam aperiam iusto. Dicta delectus doloremque illo dolores."
    },
    {
      title: "Música 3",
      image: "https://m.media-amazon.com/images/S/pv-target-images/489efd72a1886f9387d9c415d691d61195a0d42b438ff779c22f4c90de17b61e._SX1080_FMjpg_.jpg",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit aliquid adipisci, officia doloribus ea iure ipsam praesentium sit earum molestiae dolorum, maxime, quam aperiam iusto. Dicta delectus doloremque illo dolores."
    }
  ]
  constructor(private storageService: StorageService, private menuCtrl: MenuController, private router: Router) {}
  
  async ngOnInit () {
    await this.loadStorageData();
    // await this.storageService.set('views', [{name: 'intro', visited: false}]);
  }

  async cambiarColor () {
    this.actualColor = (this.actualColor === this.darkColor) ? this.lightColor : this.darkColor;
    this.textColor = (this.actualColor === this.darkColor) ?  this.lightColor : this.darkColor;
    this.toolbarColor = (this.actualColor === this.darkColor) ? this.lighterDarkColor : this.lightColor;
    this.setColor();
    await this.storageService.set('theme', {background: this.actualColor, text: this.textColor, toolBar: this.toolbarColor});
  }

  setColor () {
    document.documentElement.style.setProperty('--ion-toolbar-background', this.toolbarColor);
    document.documentElement.style.setProperty('--ion-background-color', this.actualColor);
    document.documentElement.style.setProperty('--ion-text-color', this.textColor);
  }

  async loadStorageData () {
    const savedTheme = await this.storageService.get('theme');
    if (savedTheme) {
      this.actualColor = savedTheme?.background;
      this.textColor = savedTheme?.text;
      this.toolbarColor =  savedTheme?.toolBar;
      this.setColor();
    }
  }

  openViewsMenu () {
    this.menuCtrl.open('first-menu');
    console.log('111')
  }

  goToView (view: string) {
    // console.log(typeof this.router)
    this.router.navigateByUrl(`/${view}`);
  }
}


export class Functions {
  constructor() {}
 
  goToView (router: Router, viewName: string) {
    router.navigateByUrl(`/${viewName}`);
  }
}