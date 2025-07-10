import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  // imports: [IonHeader, IonToolbar, IonTitle, IonContent],
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
  genres = [
    {
      title: "Música",
      image: "https://m.media-amazon.com/images/S/pv-target-images/489efd72a1886f9387d9c415d691d61195a0d42b438ff779c22f4c90de17b61e._SX1080_FMjpg_.jpg",
      description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit aliquid adipisci, officia doloribus ea iure ipsam praesentium sit earum molestiae dolorum, maxime, quam aperiam iusto. Dicta delectus doloremque illo dolores."
    }
  ]
  constructor() {}
}
