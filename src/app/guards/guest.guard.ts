import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem('token') && localStorage.getItem('token') === environment.cred.token) {
      this.router.navigateByUrl('/players');
      return false;
    } else {
      return true;
    }
  }

}
