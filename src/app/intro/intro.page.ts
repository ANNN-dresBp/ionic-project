import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {Router} from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ColorTheme } from '../home/home.page'

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IntroPage implements OnInit {
  theme: ColorTheme;
  constructor(private router: Router, private storageService: StorageService) { 
    this.theme = new ColorTheme(this.storageService);
  }

  async ngOnInit() {
    await this.theme.loadStorageData();
  }

  async goBack () {
    await this.storageService.set('views', [{name: 'intro', visited: true}]);
    this.router.navigateByUrl('/home');
  }

}
