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
import {Player} from "../../../../model/player";
import {ManagersService} from "../../../../services/managers/managers.service";
import {PlayerService} from "../../../../services/players/player.service";
import {Team} from "../../../../model/team";
import {ToastrService} from "ngx-toastr";
import {TeamService} from "../../../../services/team/team.service";
import {ImageUtils} from "../../../../utils/image-utils";

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

  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;

  teamForm: FormGroup;
  teamData: Team;

  constructor(
    private fb: FormBuilder,
    public managersService: ManagersService,
    public playerService: PlayerService,
    public teamService: TeamService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<TeamFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {editMode: boolean, team: Team, allTeams: Team[] }
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      primaryColor: ['#000000', Validators.required],
      secondaryColor: ['#FFFFFF', Validators.required],
      logo: ['', Validators.required],
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
    this.teamForm = this.fb.group({
      id: [editingData?.id],
      name: [editingData?.name, Validators.required],
      primaryColor: [editingData?.primaryColor, Validators.required],
      secondaryColor: [editingData?.secondaryColor, Validators.required],
      logo: [editingData?.logo, Validators.required],
      manager: [editingData?.manager?.id],
      players: [this.getPlayersIDs(editingData?.players) || []],
    });
    if (editingData?.logo) {
      this.imagePreview = editingData.logo;
    }
  }

  getPlayersIDs(players: Player[]): string[] {
    return (players || []).map(player => player.id);
  }

  onLogoSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.imageFile = target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result; // Set the preview image source
      };

      reader.readAsDataURL(this.imageFile); // Read file as data URL
      this.teamForm.patchValue({ logo: this.imageFile });
    }
  }

  async getManagers() {
    try {
      this.loading.managers = true;
      this.managersService.managers = await this.managersService.getManagers();
      // const managers = await this.managersService.getManagers();
      // const managerIds = this.data?.allTeams
      //   .filter(team => team.manager)  // Filter teams that have a manager
      //   .map(team => team.manager.id);  // Extract manager ids
      // const currentTeamManagerID = this.teamData?.manager?.id;
      // const filteredArray = managers.filter(item => !managerIds.includes(currentTeamManagerID));
     // this.managers = managers.filter( manager => manager.id !== currentTeamManagerID);
    } catch (error: any) {
      this.toastr.error(error, 'Something went wrong.');
      this.loading.managers= false;
    } finally {
      this.loading.managers = false;
    }
  }

  async getPlayers(forceFetch?: boolean) {

    try {
      this.loading.players = true;
      let players: Player[] = [];
      if (!this.playerService?.players?.length || forceFetch) {
        players = await this.playerService.getPlayers();
      } else {
        players = this.playerService.players;
      }
      const overallSelectedPlayerIds = (this.data?.allTeams || []).flatMap(team => team?.players.map(player => player.id));
      const currentTeamPlayersIDs: string[] = (this.teamData?.players || []).map( ee => ee?.id);
      const filteredArray = overallSelectedPlayerIds.filter(item => !currentTeamPlayersIDs.includes(item));

      this.playerService.players = players.filter( pl => !filteredArray.includes(pl.id));
    } catch (error: any) {
      this.toastr.error(error, 'Something went wrong.');
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
        const imageUrl = await ImageUtils.getImageUrl(this.imageFile);
        const teamData = {
          ...this.teamForm.value,
          logo: imageUrl,
        };
        await this.teamService.addTeam(teamData).then( () => {
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
        let imageUrl;
        if (this.imageFile) {
          imageUrl = await ImageUtils.getImageUrl(this.imageFile);
        } else {
          imageUrl = this.teamData?.logo
        }

        const teamData = {
          ...this.teamForm.value,
          logo: imageUrl,
        };
        await this.teamService.editTeam(this.teamForm?.value?.id, teamData).then( (players) => {
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
