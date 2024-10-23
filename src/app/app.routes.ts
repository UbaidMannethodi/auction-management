import { Routes } from '@angular/router';
import {BaseLayoutComponent} from "./components/commons/base-layout/base-layout.component";
import {PlayersComponent} from "./components/pages/players/players.component";
import {TeamsComponent} from "./components/pages/teams/teams.component";
import {ManagersComponent} from "./components/pages/managers/managers.component";

export const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {path: '', redirectTo: 'players', pathMatch: 'full'},
      { path: 'players', component: PlayersComponent },
      { path: 'teams', component: TeamsComponent },
      { path: 'managers', component: ManagersComponent },
    ],
  },
  { path: '**', redirectTo: 'players' }
];
