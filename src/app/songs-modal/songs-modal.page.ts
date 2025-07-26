import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, NavParams, ModalController} from '@ionic/angular'

@Component({
  selector: 'app-songs-modal',
  templateUrl: './songs-modal.page.html',
  styleUrls: ['./songs-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SongsModalPage implements OnInit {
  songs: any;
  constructor(private navParams: NavParams, private modalController: ModalController) { }

  ngOnInit() {
    this.songs = this.navParams.data['songs'];
    console.log(this.songs);
  }

  async selectedSong (song: any) {
    console.log(song)
    await this.modalController.dismiss(song);
  }
}
