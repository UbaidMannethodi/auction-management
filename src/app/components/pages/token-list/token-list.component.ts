import {Component, OnInit} from '@angular/core';
import {Player} from "../../../model/player";
import {MatDialog} from "@angular/material/dialog";
import {PlayerService} from "../../../services/players/player.service";
import {ToastrService} from "ngx-toastr";
import {PlayerOverviewComponent} from "../players/player-overview/player-overview.component";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {NgxLoadingModule} from "ngx-loading";
import {TeamService} from "../../../services/team/team.service";
import {Team} from "../../../model/team";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-token-list',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    NgStyle,
    NgxLoadingModule
  ],
  templateUrl: './token-list.component.html',
  styleUrl: './token-list.component.scss'
})
export class TokenListComponent implements OnInit {

  loading = {
    player: false,
    team: false,
  };
  environment = environment

  constructor(private dialog: MatDialog,
              public playerService: PlayerService,
              public teamService: TeamService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getPlayers();
    this.getTeam();
  }



  async getPlayers(forceFetch?: boolean) {
    try {
      this.loading.player = true;
      if (!this.playerService?.players?.length || forceFetch) {
        this.playerService.players = await this.playerService.getPlayers();
      }
    } catch (error: any) {
      this.loading.player = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.loading.player = false;
    }
  }

  async getTeam(forceFetch?: boolean) {
    try {
      this.loading.team = true;
      if (!this.teamService?.teams?.length || forceFetch) {
        this.teamService.teams = await this.teamService.getTeam();
      }
    } catch (error: any) {
      this.loading.team = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.loading.team = false;
    }
  }

  openPlayerOverviewDialog(player?:Player): void {
    const dialogRef = this.dialog.open(PlayerOverviewComponent, {
      width: '95vw',  // Full viewport width
      height: '95vh', // Full viewport height
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {player, teams: this.teamService.teams}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.getPlayers(true);
        this.getTeam(true);
      }
    });
  }

}
