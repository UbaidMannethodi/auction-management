import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {PlayerService} from "../../../../services/players/player.service";
import {NgxLoadingModule} from "ngx-loading";
import {ToastrService} from "ngx-toastr";
import {Player} from "../../../../model/player";
import {MatOption, MatSelect} from "@angular/material/select";
import {ImageUtils} from "../../../../utils/image-utils";
import {DataUtils} from "../../../../utils/data-utils";

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [
    MatDialogActions,
    MatButton,
    MatError,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatDialogContent,
    NgIf,
    MatDialogTitle,
    MatIcon,
    NgxLoadingModule,
    MatSelect,
    MatOption,
    NgForOf,
  ],

  providers: [],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss'
})
export class PlayerFormComponent implements OnInit {

  maxFileSizeInBytes = 5242880;  // Default 10MB

  positions = DataUtils.playerPositions;

  playerForm:FormGroup;
  playerData: Player;

  loading = false;

  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PlayerFormComponent>,
    private playerService: PlayerService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { totalPlayers: number, editMode: boolean, player: Player }
  ) {}


  ngOnInit(): void {
    this.playerData = this.data?.player as any;
    this.createForm();
    console.log('editing', this.data)
  }

  createForm(): void {
    const editingData: Player = JSON.parse(JSON.stringify(this.playerData ?? {}));
    console.log('editingData', editingData);
    this.playerForm = this.fb.group({
      id: [editingData?.id],
      tokenNo: [editingData?.tokenNo ?? (this.data.totalPlayers + 1), Validators.required],
      name: [editingData?.name, Validators.required],
      position: [editingData?.position, Validators.required],
      price: [editingData?.price],
      // team: [editingData?.team, Validators.required],
      image: [editingData?.image, Validators.required],
    });

    if (editingData?.image) {
      this.imagePreview = editingData.image;
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.data?.editMode) {
      this.createPlayer();
    } else {
      this.updatePlayer();
    }
  }


  async createPlayer(): Promise<void> {
    if (this.playerForm.valid && this.imageFile) {
      try {
        this.loading = true;
        const imageUrl = await ImageUtils.getImageUrl(this.imageFile);
        const playerData = {
          ...this.playerForm.value,
          image: imageUrl
        };
        await this.playerService.addPlayer(playerData).then( () => {
          this.toastr.success('', 'Player added successfully.');
          this.dialogRef.close({ type: 'success' });
          this.loading = false;
        });

      } catch (error: any) {
        this.loading = false;
        this.toastr.error(error, 'Something went wrong.');
      }
    }
  }

  async updatePlayer(): Promise<void> {
    if (this.playerForm.valid) {
      try {
        this.loading = true;
        let imageUrl;
        if (this.imageFile) {
          imageUrl = await ImageUtils.getImageUrl(this.imageFile);
        } else {
          imageUrl = this.data?.player?.image
        }
        const playerData = {
          ...this.playerForm.value,
          image: imageUrl
        };
        await this.playerService.editPlayer(this.playerData?.id, playerData).then( (players) => {
          console.log('players updated', players);
          this.toastr.success('', 'Player modified successfully.');
          this.dialogRef.close({type: 'success', players});
          this.loading = false;
        });
      } catch (error: any) {
        this.loading = false;
        this.toastr.error(error, 'Something went wrong.');
      }
    }
  }


  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {

      if (this.maxFileSizeInBytes < target.files[0].size) {
        this.toastr.success('', 'Size cannot exceed 5MB');
        return;
      }

      this.imageFile = target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result; // Set the preview image source
      };

      reader.readAsDataURL(this.imageFile); // Read file as data URL
      this.playerForm.patchValue({ image: this.imageFile });
    }

    console.log('ss', this.playerForm)
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
