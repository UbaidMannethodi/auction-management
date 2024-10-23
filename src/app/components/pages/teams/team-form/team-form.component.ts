import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {NgForOf, NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {NgxLoadingModule} from "ngx-loading";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {Manager} from "../../../../model/manager";
import {Player} from "../../../../model/player";
import {ManagersService} from "../../../../services/managers/managers.service";
import {PlayerService} from "../../../../services/players/player.service";
import {Team} from "../../../../model/team";
import {ToastrService} from "ngx-toastr";
import {TeamService} from "../../../../services/team/team.service";

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    MatDialogActions,
    MatButton,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    NgIf,
    MatDialogContent,
    MatInput,
    MatError,
    MatDialogTitle,
    MatIcon,
    NgxLoadingModule,
    MatOption,
    MatSelect,
    NgForOf
  ],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss'
})
export class TeamFormComponent implements OnInit {

  loading = {
    posting: false,
    team: false,
    managers: false,
    players: false,
  }

  teamForm: FormGroup;
  teamData: Team;
  managers: Manager[] = [];
  players: Player[] = [];

  constructor(
    private fb: FormBuilder,
    private managersService: ManagersService,
    private playerService: PlayerService,
    private teamService: TeamService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<TeamFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {editMode: boolean, team: Team }
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      primaryColor: ['#000000', Validators.required],
      secondaryColor: ['#FFFFFF', Validators.required],
      manager: [''],
      players: [''],
    });
  }

  ngOnInit(): void {
    this.teamData = this.data?.team as any;
    this.getManagers();
    this.getPlayers();
    this.createForm();
  }

  createForm(): void {
    const editingData: Team = JSON.parse(JSON.stringify(this.teamData ?? {}));
    console.log('editingData', editingData);
    this.teamForm = this.fb.group({
      id: [editingData?.id],
      name: [editingData?.name, Validators.required],
      primaryColor: [editingData?.primaryColor, Validators.required],
      secondaryColor: [editingData?.secondaryColor, Validators.required],
      manager: [editingData?.manager?.id],
      players: [this.getPlayersIDs(editingData?.players) || []],
    });
  }

  getPlayersIDs(players: Player[]): string[] {
    return (players || []).map(player => player.id);
  }

  async getManagers() {
    try {
      this.loading.managers = true;
      this.managers = await this.managersService.getManagers();
    } catch (error: any) {
      this.loading.managers= false;
    } finally {
      this.loading.managers = false;
    }
  }

  async getPlayers() {
    try {
      this.loading.players = true;
      this.players = await this.playerService.getPlayers();
    } catch (error: any) {
      this.loading.players = false;
    } finally {
      this.loading.players = false;
    }
  }
  async onSubmit(): Promise<void> {
    if (!this.data?.editMode) {
      this.createTeam();
    } else {
      this.updateTeam();
    }
  }

  async createTeam(): Promise<void> {
    if (this.teamForm.valid) {
      try {
        this.loading.posting = true;
        await this.teamService.addTeam(this.teamForm.value).then( () => {
          this.toastr.success('', 'Team added successfully.');
          this.dialogRef.close({ type: 'success' });
          this.loading.posting = false;
        });

      } catch (error: any) {
        this.loading.posting = false;
        this.toastr.error(error, 'Something went wrong.');
      }
    }
  }

  async updateTeam(): Promise<void> {
    if (this.teamForm.valid) {
      try {
        this.loading.posting = true;
        await this.teamService.editTeam(this.teamForm?.value?.id, this.teamForm?.value).then( (players) => {
          console.log('Team updated', players);
          this.toastr.success('', 'Team modified successfully.');
          this.dialogRef.close({type: 'success', players});
          this.loading.posting = false;
        });
      } catch (error: any) {
        this.loading.posting = false;
        this.toastr.error(error, 'Something went wrong.');
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
