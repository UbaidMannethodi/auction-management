import {Component, Inject} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgxLoadingModule} from "ngx-loading";
import {Player} from "../../../../model/player";
import {Team} from "../../../../model/team";
import {PlayerService} from "../../../../services/players/player.service";
import {TeamService} from "../../../../services/team/team.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-player-overview',
  standalone: true,
  imports: [
    MatFormField,
    MatOption,
    MatSelect,
    NgForOf,
    FormsModule,
    MatInput,
    NgxLoadingModule
  ],
  templateUrl: './player-overview.component.html',
  styleUrl: './player-overview.component.scss'
})
export class PlayerOverviewComponent {

  isImageLoading: boolean = false;
  loading = false;

  amount: number;
  selectedTeam: Team;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {player: Player, teams: Team[]},
    private dialogRef: MatDialogRef<PlayerOverviewComponent>,
    private playerService: PlayerService,
    private teamService: TeamService,
    private toastr: ToastrService
  ) {
    this.isImageLoading = true;
    if (this.data?.player?.price) {
      this.amount = this.data.player.price;
    }

    const team = this.teamService?.getTeamByPlayerId(this.data?.teams, this.data?.player?.id)
    if (team?.id) {
      this.selectedTeam = team;
    }
    if (this.data?.player?.price) {
      this.amount = this.data.player.price;
    }

  }


  async updatePlayerDetails() {

    if (!this.amount || !this.selectedTeam) {
      return;
    }

    const playerId = this.data?.player?.id;
    const teamId = this.selectedTeam?.id;
    const teamPlayerIDs: string[] = (this.selectedTeam.players || []).map( ee => ee?.id);

    const playerDetails: Player = {
      ...this.data.player,
      price: this.amount
    }

    const teamDetails: Team = {
      ...this.selectedTeam,
      manager: this.selectedTeam?.manager?.id || null,
      players: [...new Set([...(teamPlayerIDs || []), playerId])],
    }
    try {
      this.loading = true;
      await this.playerService.editPlayer(playerId, playerDetails);
      await this.teamService.editTeam(teamId, teamDetails);
      this.loading = false;
      this.dialogRef.close({success: true});

    } catch ( error: any) {

      this.toastr.error(error, 'Something went wrong.');
      this.loading = false;

    }

  }

  onImageLoad() {
    this.isImageLoading = false;
  }

  onImageError() {
    this.isImageLoading = false;
  }

}
