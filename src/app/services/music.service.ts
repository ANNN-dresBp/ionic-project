import { Injectable } from '@angular/core';
import * as dataArtists from './artistas.json';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  urlServer = 'https://music.fly.dev';
  constructor() { }

  getTracks() {
    return fetch(`${this.urlServer}/tracks`).then(
      response => response.json() 
    );
  }

  getAlbums() {
    return fetch(`${this.urlServer}/albums`).then(
      response => response.json() 
    );
  }

  getLocalArtists() {
    return dataArtists.artists;
  }

  getSongsByAlbum(id: string) {
    return fetch(`${this.urlServer}/tracks/album/${id}`).then(
      response => response.json() 
    );
  }

  getArtists() {
    return fetch(`${this.urlServer}/artists`).then(
      response => response.json() 
    );
  }

  getSongsByArtist(id: string) {
    return fetch(`${this.urlServer}/tracks/artist/${id}`).then(
      response => response.json() 
    );
  }
} 
