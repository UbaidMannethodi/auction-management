import {Component, Inject} from '@angular/core';
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
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";

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
    MatIcon
  ],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss'
})
export class TeamFormComponent {

  teamForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      primaryColor: ['#000000'],
      secondaryColor: ['#FFFFFF'],
    });

    // If editing an existing team, populate the form
    if (data) {
      this.teamForm.patchValue(data);
    }
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      this.dialogRef.close(this.teamForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
