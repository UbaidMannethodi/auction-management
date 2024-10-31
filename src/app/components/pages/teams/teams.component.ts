import {Component, OnInit} from '@angular/core';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ConfirmDialogComponent} from "../../commons/confirm-dialog/confirm-dialog.component";
import {TeamService} from "../../../services/team/team.service";
import {Team} from "../../../model/team";
import {TeamFormComponent} from "./team-form/team-form.component";
import {MatIcon} from "@angular/material/icon";
import {NgxLoadingModule} from "ngx-loading";
import {TeamOverviewComponent} from "./team-overview/team-overview.component";
import {TeamStatusComponent} from "./team-status/team-status.component";
import {Player} from "../../../model/player";
import {DataUtils} from "../../../utils/data-utils";


@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatLabel,
    MatError,
    NgIf,
    NgForOf,
    NgStyle,
    MatIcon,
    MatIconButton,
    NgxLoadingModule
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {

  loading = false;
  dataUtils = DataUtils;

  constructor(private dialog: MatDialog,
              public teamService: TeamService,
              private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getTeams();
  }

  async getTeams(forceFetch?: boolean, showLoader = true) {
    try {
      if (showLoader) {
        this.loading = true;
      }
      if (!this.teamService?.teams?.length || forceFetch) {
        this.teamService.teams = await this.teamService.getTeam();
      }

    } catch (error: any) {
      this.loading = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.loading = false;
    }
  }

  openConfirmDialog(team: Team): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete <b>${team.name}</b>?`,
      },
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteTeam(team);
      }
    });
  }

  async deleteTeam(team: Team) {
    try {
      this.loading = true;
      await this.teamService.deleteTeam(team?.id);
    } catch (error: any) {
      this.loading = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.teamService.teams = this.teamService.teams.filter(p => p.id !== team.id);
      this.getTeams(true, true);
      this.loading = false;
    }
  }

  getPlayersWithPlaceholders(players: Player[]): any[] {
    const defaultPlayers = Array.from({ length: 7 - players.length }, (_, i) => ({
      image: '/images/icons/player_avatar_white.jpeg',
      name: `Player ${players.length + i + 1}`,
      position: ''
    }));

    return [...players, ...defaultPlayers];
  }

  openAddTeamDialog(team?: Team): void {
    const editMode = !!team
    const dialogRef = this.dialog.open(TeamFormComponent, {
      width: '400px',
      data: {editMode, team, totalTeams: this.teamService.teams?.length, allTeams: this.teamService.teams}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.type === 'success') {
        this.getTeams(true);
      }
    });
  }

  openTeamOverviewDialog(team:Team): void {
    const dialogRef = this.dialog.open(TeamOverviewComponent, {
      minWidth: '95vw',
      minHeight: '95vh',
      panelClass: 'team-lineup-dialog',
      data: {team: {...team, ...{players: this.getPlayersWithPlaceholders(team.players)}}}
    });
  }

  openTeamStatusDialog(team:Team): void {
    console.log('tt', this.teamService.getTeamStatus(team))
    const dialogRef = this.dialog.open(TeamStatusComponent, {
      minWidth: '95vw',
      minHeight: '95vh',
      data: {
        teamStatus: this.teamService.getTeamStatus(team),
        team: team
      }
    });
  }

}
