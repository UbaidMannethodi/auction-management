
import {Injectable} from '@angular/core';
import {Player} from "../../model/player";
import {
  Firestore,
  collection,
  addDoc,
  getDoc,
  CollectionReference,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc
} from '@angular/fire/firestore';
import { doc } from 'firebase/firestore';
import {DbConstants} from "../../constants/db-constants";


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private TABLE_PLAYERS = DbConstants.TABLE_PLAYERS

  playersCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.playersCollection = collection(this.firestore, this.TABLE_PLAYERS);
  }


  async addPlayer(student: Player) {
    // Get a reference to the 'players' collection
    const playersCollection = collection(this.firestore, this.TABLE_PLAYERS);

    // Generate a new document reference to get the ID
    const newDocRef = doc(playersCollection);

    // Assign the generated document ID to the student object before adding it
    student.id = newDocRef.id;

    // Add the student to Firestore with the assigned ID
    await setDoc(newDocRef, student);
  }


  async getPlayers(): Promise<Player[]> {
    const snapshot = await getDocs(this.playersCollection); // Fetches data once
    return snapshot.docs.map(doc => doc.data()) as Player[];
  }

  async editPlayer(playerId: string, updatedPlayer: Partial<Player>) {
    try {

      const playerDocRef = doc(this.firestore, this.TABLE_PLAYERS, playerId);

      const playerDocSnapshot = await getDoc(playerDocRef);

      if (!playerDocSnapshot.exists()) {
        console.error(`Player with ID ${playerId} not found.`);
        throw new Error(`Player with ID ${playerId} does not exist.`);
      }

      console.log('Updating player document:', updatedPlayer, playerDocRef);
      await updateDoc(playerDocRef, updatedPlayer);

      console.log('Player updated successfully.');
    } catch (error) {
      console.error('Error updating player:', error);
    }
  }


  async deletePlayer(playerId: string) {
    // Get a reference to the player document
    const playerDoc = doc(this.firestore, this.TABLE_PLAYERS, playerId);
    // Delete the document
    await deleteDoc(playerDoc);
  }

}
