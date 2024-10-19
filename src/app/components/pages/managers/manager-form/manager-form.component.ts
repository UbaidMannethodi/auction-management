import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-manager-form',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './manager-form.component.html',
  styleUrl: './manager-form.component.scss'
})
export class ManagerFormComponent implements OnInit {
  managerForm:FormGroup;

  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ManagerFormComponent>
  ) {}


  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.managerForm = this.fb.group({
      name: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.managerForm.valid) {
      this.dialogRef.close(this.managerForm.value);
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
      this.managerForm.patchValue({ image: file }); // Update form value
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
