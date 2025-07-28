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

  async getUserFavoriteSongs(userId: any) {
    return await fetch(`${this.urlServer}/user_favorites/${userId}`).then(
      response => response.json() 
    );
  }

  async addFavoriteSong(userId: any, songId: any) {
    return await fetch(`${this.urlServer}/favorite_tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "favorite_track": {
          "user_id": userId,
          "track_id": songId
        }
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  async removeFavoriteSong(songId: any) {
    return await fetch(`${this.urlServer}/favorite_tracks/${songId}`).then(
      response => response.json() 
    );
  }
} 
