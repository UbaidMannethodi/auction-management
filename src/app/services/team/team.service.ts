import {Injectable} from '@angular/core';
import {DbConstants} from "../../constants/db-constants";
import {
  collection,
  CollectionReference,
  deleteDoc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from "@angular/fire/firestore";
import {doc} from "firebase/firestore";
import {Team} from "../../model/team";
import {Manager} from "../../model/manager";

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private TABLE_TEAMS = DbConstants.TABLE_TEAMS

  teamsCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.teamsCollection = collection(this.firestore, this.TABLE_TEAMS);
  }

  async addTeam(team: Team) {
    const teamCollection = collection(this.firestore, this.TABLE_TEAMS);
    const newDocRef = doc(teamCollection);

    team.id = newDocRef.id;

    await setDoc(newDocRef, team);
  }

  // async getTeam(): Promise<Team[]> {
  //   const snapshot = await getDocs(this.teamsCollection);
  //   return snapshot.docs.map(doc => doc.data()) as Team[];
  // }

  // Method to fetch all teams with their managers and players in a single batch
  async getTeam(): Promise<any[]> {
    const teamsCollection = collection(this.firestore, 'teams');

    // Fetch all teams
    const teamSnapshots = await getDocs(teamsCollection);
    const teams = teamSnapshots.docs.map(doc => doc.data()) as Team[];
    console.log('team', teams)
    const managerIds = teams.map(team => team.manager) || [];
    const playerIds = teams.reduce((ids, team) => ids.concat(team.players), [] as string[]) || [];

    // Batch fetch all managers
    let managers: any;
    if (managerIds?.length) {
      const managersCollection = collection(this.firestore, 'managers');
      const managerQuery = query(managersCollection, where('id', 'in', managerIds));
      const managerSnapshots = await getDocs(managerQuery);
      managers = managerSnapshots.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {} as Record<string, any>);
    }

    // Batch fetch all players
    let players: any;
    if (playerIds?.length) {
      const playersCollection = collection(this.firestore, 'players');
      const playerQuery = query(playersCollection, where('id', 'in', playerIds));
      const playerSnapshots = await getDocs(playerQuery);
      players = playerSnapshots.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {} as Record<string, any>);
    }

    // Map team details to include manager and players
    return teams.map(team => ({
      // id: team.id,
      // name: team.name,
      // primaryColor: team.primaryColor,
      // secondaryColor: team.secondaryColor,
      ...team,
      manager: managers[team.manager],
      players: (team.players || []).map(playerId => players[playerId]),
    }));
  }


  async editTeam(teamID: string, updatedTeam: Partial<Team>) {
    try {

      const teamDocRef = doc(this.firestore, this.TABLE_TEAMS, teamID);

      const teamDocSnapshot = await getDoc(teamDocRef);

      if (!teamDocSnapshot.exists()) {
        console.error(`manager with ID ${teamID} not found.`);
        throw new Error(`team with ID ${teamID} does not exist.`);
      }

      console.log('Updating team document:', updatedTeam, teamDocRef);
      await updateDoc(teamDocRef, updatedTeam);

      console.log('team updated successfully.');
    } catch (error) {
      console.error('Error updating team:', error);
    }
  }

  async deleteTeam(teamID: string) {
    const teamDoc = doc(this.firestore, this.TABLE_TEAMS, teamID);
    await deleteDoc(teamDoc);
  }
}
