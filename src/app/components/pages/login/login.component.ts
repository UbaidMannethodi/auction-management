import { Component } from '@angular/core';
import {FormBuilder, FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private toastr: ToastrService, private router: Router) { }

  onSubmit() {
    if (!this.username) {
      this.toastr.error('', 'Username required.');
      return;
    } else if (!this.password) {
      this.toastr.error('', 'Please enter password.');
      return;
    }

    if (this.username === environment.cred.username && this.password === environment.cred.password) {
      localStorage.setItem('token', environment.cred.token);
      this.router.navigate(['/players'])
    } else {
      this.toastr.error('', 'Please check your credentials.');
    }
  }


}
