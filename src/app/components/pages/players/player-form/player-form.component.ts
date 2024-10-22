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
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {PlayerService} from "../../../../services/player.service";

import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import {NgxLoadingModule} from "ngx-loading";
import {ToastrService} from "ngx-toastr";
import {Player} from "../../../../model/player";

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
  ],

  providers: [],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss'
})
export class PlayerFormComponent implements OnInit {

  playerForm:FormGroup;
  playerData: Player;

  loading = false

  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PlayerFormComponent>,
    private playerService: PlayerService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { editMode?: boolean, player?: Player }
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
      name: [editingData?.name, Validators.required],
      position: [editingData?.position, Validators.required],
      price: [editingData?.price, Validators.required],
      team: [editingData?.team, Validators.required],
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
        const imageUrl = await this.getImageUrl(this.imageFile);
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
          imageUrl = await this.getImageUrl(this.imageFile);
        } else {
          imageUrl = this.data?.player?.image
        }
        const playerData = {
          ...this.playerForm.value,
          image: imageUrl
        };
        await this.playerService.editPlayer(this.playerData?.id, playerData).then( () => {
          this.toastr.success('', 'Player modified successfully.');
          this.dialogRef.close({type: 'success'});
          this.loading = false;
        });
      } catch (error: any) {
        this.loading = false;
        this.toastr.error(error, 'Something went wrong.');
      }
    }
  }

  getImageUrl(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string; // Get the data URL
          await uploadString(storageRef, dataUrl, 'data_url'); // Upload the image
          const downloadURL = await getDownloadURL(storageRef); // Get the download URL
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error); // Handle FileReader error
      reader.readAsDataURL(imageFile); // Read the file as a data URL
    });
  }


  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.imageFile = target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result; // Set the preview image source
      };

      reader.readAsDataURL(this.imageFile); // Read file as data URL
      this.playerForm.patchValue({ image: this.imageFile });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
