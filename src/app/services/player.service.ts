// src/app/services/player.service.ts

import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {Player} from "../model/player";


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private playersCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.playersCollection = collection(this.firestore, 'players');
  }

  addPlayer(player: Player): Promise<void> {
    return addDoc(this.playersCollection, player)
      .then(() => {
        console.log('Player added successfully');
      })
      .catch(error => {
        console.error('Error adding player: ', error);
      });
  }

}
