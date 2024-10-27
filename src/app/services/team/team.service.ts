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
  where, writeBatch
} from "@angular/fire/firestore";
import {doc} from "firebase/firestore";
import {Team, TeamStatus} from "../../model/team";
import {environment} from "../../../environments/environment";
import {DataUtils} from "../../utils/data-utils";


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private TABLE_TEAMS = DbConstants.TABLE_TEAMS

  teamsCollection: CollectionReference;
  teams: Team[] = [];

  constructor(private firestore: Firestore) {
    this.teamsCollection = collection(this.firestore, this.TABLE_TEAMS);
  }


  getTeamStatus(team: Team): TeamStatus {
    if (team) {
      const totalPrice = team?.players.reduce((sum, player) => {
        return sum + (player?.price || 0);
      }, 0);

      const groupedPlayersByPosition = team?.players.reduce((acc, player) => {
        if (!acc[player?.position]) {
          acc[player?.position] = [];
        }
        acc[player?.position].push(player);
        return acc;
      }, {} as { [key: string]: any[] });

      const selectedPositions = Object.keys(groupedPlayersByPosition || {});
      const positions = DataUtils.playerPositions.map( position => position.id);
      const positionToSelect: any = positions.filter(item => !selectedPositions.includes(item));

      const teamStatus: any = {};
      teamStatus.availableAmount = environment.team.availableAmount;
      teamStatus.balanceAmount = environment.team.availableAmount - totalPrice;
      teamStatus.selectedPositions = groupedPlayersByPosition;
      teamStatus.PositionToSelect = positionToSelect;
      return teamStatus;
    } else {
      return null;
    }
  }

  getTeamByPlayerId(teams: Team[], playerId: string) {
    if (!teams?.length || !playerId) {
      return null;
    }
    return teams.find(team =>
      team.players && team.players.some(player => player.id === playerId)
    );
  }

  async addTeam(team: Team) {
    const teamCollection = collection(this.firestore, this.TABLE_TEAMS);
    const newDocRef = doc(teamCollection);

    team.id = newDocRef.id;

    await setDoc(newDocRef, team);
  }

  async getTeamBasicDetails(): Promise<Team[]> {
    const snapshot = await getDocs(this.teamsCollection);
    return snapshot.docs.map(doc => doc.data()) as Team[];
  }

  // Method to fetch all teams with their managers and players in a single batch
  async getTeam(): Promise<any[]> {
    const teamsCollection = collection(this.firestore, 'teams');

    // Fetch all teams
    const teamSnapshots = await getDocs(teamsCollection);
    const teams = teamSnapshots.docs.map(doc => doc.data()) as Team[];
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
      ...team,
      manager: managers[team.manager] || null,
      players: (team.players || []).map(playerId => players[playerId] || null).filter(Boolean)
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


  async updateTeamWhenPlayerUpdate(playerID: string): Promise<void> {
    // Reference to the teams collection
    const teamCollectionRef = collection(this.firestore, 'teams');

    // Query to find all teams containing the playerID in the 'players' field
    const teamsWithPlayerQuery = query(teamCollectionRef, where('players', 'array-contains', playerID));

    // Fetch the teams that match the query
    const teamSnapshots = await getDocs(teamsWithPlayerQuery);

    // Check if there are any teams to update
    if (!teamSnapshots.empty) {
      // Initialize the batch
      const batch = writeBatch(this.firestore);

      teamSnapshots.forEach((teamDoc) => {
        const teamData = teamDoc.data();

        // Remove the playerID from the players array
        const updatedPlayers = teamData['players'].filter((id: string) => id !== playerID);

        // Only add to batch if there was a change
        if (updatedPlayers.length !== teamData['players'].length) {
          const teamDocRef = doc(this.firestore, 'teams', teamDoc.id);
          batch.update(teamDocRef, { players: updatedPlayers });
        }
      });

      // Commit the batch update if there are changes
      if (batch) {
        await batch.commit();
        console.log('Batch update committed successfully');
      }
    } else {
      console.log('No teams found with the specified player ID');
    }
  }

  async updateTeamsWhenManagerRemoved(managerID: string): Promise<void> {
    // Reference to the teams collection
    const teamCollectionRef = collection(this.firestore, 'teams');

    // Query to find all teams where the manager field matches the managerID
    const teamsWithManagerQuery = query(teamCollectionRef, where('manager', '==', managerID));

    // Fetch the teams that match the query
    const teamSnapshots = await getDocs(teamsWithManagerQuery);

    // Check if there are any teams to update
    if (!teamSnapshots.empty) {
      // Initialize the batch
      const batch = writeBatch(this.firestore);

      teamSnapshots.forEach((teamDoc) => {
        const teamData = teamDoc.data();

        // Only add to batch if the manager ID matches and needs removal
        if (teamData['manager'] === managerID) {
          const teamDocRef = doc(this.firestore, 'teams', teamDoc.id);
          batch.update(teamDocRef, { manager: null });  // or '' if you prefer an empty string
        }
      });

      // Commit the batch update if there are changes
      await batch.commit();
      console.log('Batch update committed successfully for manager removal');
    } else {
      console.log('No teams found with the specified manager ID');
    }
  }

}
