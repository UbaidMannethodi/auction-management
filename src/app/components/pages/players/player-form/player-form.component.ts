import {Component, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {PlayerService} from "../../../../services/player.service";

import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

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
    MatIcon
  ],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss'
})
export class PlayerFormComponent implements OnInit {

  playerForm:FormGroup;

  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PlayerFormComponent>,
    private playerService: PlayerService
  ) {}


  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.playerForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      price: ['', Validators.required],
      team: ['', Validators.required],
      image: [null, ],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.playerForm.valid && this.imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${this.imageFile.name}`);

      try {
        // Read the file as a data URL using FileReader
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string; // Get the data URL

          // Upload the image
          await uploadString(storageRef, dataUrl, 'data_url');

          // Get the download URL
          const downloadURL = await getDownloadURL(storageRef);

          // Prepare player data
          const playerData = {
            ...this.playerForm.value,
            image: downloadURL // Store the image URL in the player data
          };

          await this.playerService.addPlayer(playerData); // Add player to Firebase
          this.dialogRef.close(); // Close the dialog
        };

        reader.readAsDataURL(this.imageFile); // Read the file as data URL
      } catch (error) {
        console.error('Error uploading image or saving player: ', error);
      }
    }
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
      // this.playerForm.patchValue({ image: this.imageFile }); // Update form value
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
