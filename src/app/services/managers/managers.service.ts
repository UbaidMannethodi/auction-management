import { Injectable } from '@angular/core';
import {DbConstants} from "../../constants/db-constants";
import {
  collection,
  CollectionReference,
  deleteDoc,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from "@angular/fire/firestore";
import {Player} from "../../model/player";
import {doc} from "firebase/firestore";
import {Manager} from "../../model/manager";

@Injectable({
  providedIn: 'root'
})
export class ManagersService {

  private TABLE_MANAGERS = DbConstants.TABLE_MANAGERS

  managersCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.managersCollection = collection(this.firestore, this.TABLE_MANAGERS);
  }

  async addManager(manager: Manager) {
    const managersCollection = collection(this.firestore, this.TABLE_MANAGERS);
    const newDocRef = doc(managersCollection);

    manager.id = newDocRef.id;

    await setDoc(newDocRef, manager);
  }

  async getManagers(): Promise<Manager[]> {
    const snapshot = await getDocs(this.managersCollection);
    return snapshot.docs.map(doc => doc.data()) as Manager[];
  }


  async editManager(managerID: string, updatedPlayer: Partial<Player>) {
    try {

      const managerDocRef = doc(this.firestore, this.TABLE_MANAGERS, managerID);

      const playerDocSnapshot = await getDoc(managerDocRef);

      if (!playerDocSnapshot.exists()) {
        console.error(`manager with ID ${managerID} not found.`);
        throw new Error(`manager with ID ${managerID} does not exist.`);
      }

      console.log('Updating manager document:', updatedPlayer, managerDocRef);
      await updateDoc(managerDocRef, updatedPlayer);

      console.log('manager updated successfully.');
    } catch (error) {
      console.error('Error updating manager:', error);
    }
  }

  async deleteManager(mangerID: string) {
    const managerDoc = doc(this.firestore, this.TABLE_MANAGERS, mangerID);
    await deleteDoc(managerDoc);
  }
}
