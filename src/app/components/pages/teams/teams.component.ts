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

  teams: Team[] = [];
  loading = false;

  constructor(private dialog: MatDialog,
              private teamService: TeamService,
              private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getTeams();
  }

  async getTeams() {
    try {
      this.loading = true;
      this.teams = await this.teamService.getTeam();
      console.log('team', this.teams);
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
      this.teams = this.teams.filter(p => p.id !== team.id);
      this.loading = false;
    }
  }

  openAddTeamDialog(team?: Team): void {
    const editMode = !!team
    const dialogRef = this.dialog.open(TeamFormComponent, {
      width: '400px',
      data: {editMode, team, totalTeams: this.teams?.length}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.type === 'success') {
        this.getTeams();
      }
    });
  }

}
