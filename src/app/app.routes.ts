import { Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";
import {GuestGuard} from "./guards/guest.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/commons/base-layout/base-layout.component').then(c => c.BaseLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'players', pathMatch: 'full'},
      { path: 'players',
        loadComponent: () => import('./components/pages/players/players.component').then(c => c.PlayersComponent),
      },
      { path: 'teams',
        loadComponent: () => import('./components/pages/teams/teams.component').then(c => c.TeamsComponent),
      },
      { path: 'managers',
        loadComponent: () => import('./components/pages/managers/managers.component').then(c => c.ManagersComponent),
      },
      { path: 'tokens',
        loadComponent: () => import('./components/pages/token-list/token-list.component').then(c => c.TokenListComponent),
      },
    ],
  },
  {path: 'login', canActivate: [GuestGuard],
    loadComponent: () => import('./components/pages/login/login.component').then(c => c.LoginComponent),
  },
  { path: '**',
    loadComponent: () => import('./components/commons/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent),
  }
];
