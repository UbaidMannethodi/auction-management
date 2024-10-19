import { Component } from '@angular/core';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {TeamFormComponent} from "./team-form/team-form.component";
import {MatDialog} from "@angular/material/dialog";

interface Team {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}


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
    NgStyle
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {

  teams: Team[] = [
    { name: 'Argentina', logo: 'path/to/argentina-logo.png', primaryColor: '#A500A1', secondaryColor: '#B2B2B2' },
    { name: 'Brazil', logo: 'path/to/brazil-logo.png', primaryColor: '#3E4095', secondaryColor: '#FFD700' },
    // Add more teams as needed
  ];

  teamForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      logo: ['', Validators.required],
      primaryColor: ['#000000'],
      secondaryColor: ['#FFFFFF'],
    });
  }

  openAddTeamDialog(): void {
    const dialogRef = this.dialog.open(TeamFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teams.push(result);
      }
    });
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      this.teams.push(this.teamForm.value);
      this.teamForm.reset();
    }
  }

}
