import {Component, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PlayerFormComponent>
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
      image: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      this.dialogRef.close(this.playerForm.value);
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.playerForm.patchValue({ image: file }); // Update form value
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
