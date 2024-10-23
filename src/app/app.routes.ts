import { Routes } from '@angular/router';
import {BaseLayoutComponent} from "./components/commons/base-layout/base-layout.component";
import {PlayersComponent} from "./components/pages/players/players.component";
import {TeamsComponent} from "./components/pages/teams/teams.component";
import {ManagersComponent} from "./components/pages/managers/managers.component";
import {TokenListComponent} from "./components/pages/token-list/token-list.component";
import {LoginComponent} from "./components/pages/login/login.component";
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {
    path: '',
    component: BaseLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'players', pathMatch: 'full'},
      { path: 'players', component: PlayersComponent },
      { path: 'teams', component: TeamsComponent },
      { path: 'managers', component: ManagersComponent },
      { path: 'tokens', component: TokenListComponent },
    ],
  },
  { path: '**', redirectTo: 'players' }
];
