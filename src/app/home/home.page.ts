import { Component, OnInit, ElementRef } from '@angular/core';
import { IonicModule, ModalController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, MenuController} from '@ionic/angular/standalone';
import {Router} from '@angular/router';
import { MusicService } from '../services/music.service';
import { SongsModalPage } from '../songs-modal/songs-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  theme: ColorTheme;
  tracks: any;
  artists: any;
  albums: any;
  song: any = {
    name: '',
    preview_url: '',
    playing: false,
  };
  currentSong: any = {};
  newTime: any;
  
  constructor(private storageService: StorageService, private router: Router, private musicService: MusicService, private element: ElementRef, private modalController: ModalController) {
    this.theme = new ColorTheme(this.storageService, this.element);
  }
  
  async ngOnInit () {
    await this.theme.loadStorageData();
    this.loadAlbums();
    this.loadArtists();
  }

  goToView (view: string) {
    // console.log(typeof this.router)
    this.router.navigateByUrl(`/${view}`);
  }

  loadTracks() {
    this.musicService.getTracks().then(tracks => {
      this.tracks = tracks
      console.log(this.tracks)
    });
  }

  loadAlbums() {
    this.musicService.getAlbums().then(albums => {
      this.albums = albums
      console.log(this.albums)
    });
  }
  
  loadArtists() {
    this.musicService.getArtists().then(artists => {
      this.artists = artists;
      console.log(this.artists);
    });;
  }

  async loadSongsByAlbum(albumId: string) {
    const songs = await this.musicService.getSongsByAlbum(albumId);
    const modal = await this.creatSongsModalPage(songs);
    modal.onDidDismiss().then((result) =>  {
      if (result.data) {
        console.log(result.data);
        this.song = result.data;
      }
    })
    modal.present();
  }

  async loadSongsByArtist(artistId: string) {
    console.log(artistId);
    const songs = await this.musicService.getSongsByArtist(artistId);
    const modal = await this.creatSongsModalPage(songs);
    modal.onDidDismiss().then((result) =>  {
      if (result.data) {
        console.log(result.data);
        this.song = result.data;
      }
    })
    modal.present();
  }

  playSong() {
    this.currentSong = new Audio(this.song.preview_url);
    this.currentSong.play();
    this.currentSong.addEventListener('timeupdate', () => {
      this.newTime = (this.currentSong.currentTime * (this.currentSong.duration / 10)) / 100;
    });
    this.song.playing = true;
  }

  pauseSong() {
    this.currentSong.pause();
    this.song.playing = false;
  }

  formatTime(seconds: number) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getRemainingTime () {
    if (!this.currentSong?.duration || !this.currentSong?.currentTime) {
      return 0;
    } 
    return this.currentSong.duration - this.currentSong.currentTime;
  }

  async creatSongsModalPage(songs: any) {
    return await this.modalController.create(
      {
        component: SongsModalPage,
        componentProps: {
          songs: songs
        }
      }
    );
  }
}


export class RoutesNavigation {
  constructor(private router: Router) {}
 
  goToView (viewName: string) {
    this.router.navigateByUrl(`/${viewName}`);
  }
}

export class ColorTheme {
  lightColor = 'var(--light-color)';
  darkColor = 'var(--dark-color)';
  lighterDarkColor = 'var(--lighter-dark-color)'; 
  actualColor = this.darkColor;
  textColor = this.lightColor;

  constructor (private storageService: StorageService, private element: ElementRef) {}

  async loadStorageData () {
    const savedTheme = await this.storageService.get('theme');
    if (savedTheme) {
      this.actualColor = savedTheme?.background;
      this.textColor = savedTheme?.text;
    }
    this.setColor();
  }

  async cambiarColor () {
    this.actualColor = (this.actualColor === this.darkColor) ? this.lightColor : this.darkColor;
    this.textColor = (this.actualColor === this.darkColor) ?  this.lightColor : this.darkColor;
    this.setColor();
    await this.storageService.set('theme', {background: this.actualColor, text: this.textColor});
  }

  setColor () {
    const hostElement = this.element.nativeElement;
    hostElement.style.setProperty('--ion-background-color', this.actualColor);
    hostElement.style.setProperty('--ion-text-color', this.textColor);
  }
}