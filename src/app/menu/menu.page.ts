import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController} from '@ionic/angular';
import { RoutesNavigation } from '../home/home.page';
import {Router} from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MenuPage implements OnInit {
  functions: RoutesNavigation;
  constructor(public router: Router, private menu: MenuController, private storage: StorageService) {
    this.functions = new RoutesNavigation(this.router);
  }

  ngOnInit() {
  }

  async goToLogin () {
    await this.storage.remove('userSession');
    this.functions.goToView('/login');
  }
}
