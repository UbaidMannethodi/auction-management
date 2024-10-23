import {Component, OnInit} from '@angular/core';
import {Player} from "../../../model/player";
import {MatDialog} from "@angular/material/dialog";
import {PlayerService} from "../../../services/players/player.service";
import {ToastrService} from "ngx-toastr";
import {PlayerOverviewComponent} from "../players/player-overview/player-overview.component";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-token-list',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    NgStyle
  ],
  templateUrl: './token-list.component.html',
  styleUrl: './token-list.component.scss'
})
export class TokenListComponent implements OnInit {

  loading = false;
  players: Player[];


  tokens = Array.from({ length: 40 }, (_, i) => i + 1);
  selectedTokens: number[] = [];

  // Sample teams array
  teams = [
    { team: 'Team 1', total: 700, balance: 250, bg: 'red', primaryColor: 'black' },
    { team: 'Team 2', total: 600, balance: 200, bg: '#f5f5f5', primaryColor: '#333' },
    { team: 'Team 3', total: 500, balance: 300, bg: 'white', primaryColor: 'black' },
    { team: 'Team 4', total: 800, balance: 150, bg: '#fff', primaryColor: '#111' },
    { team: 'Team 5', total: 450, balance: 350, bg: '#f0f0f0', primaryColor: '#222' },
    { team: 'Team 6', total: 650, balance: 280, bg: '#f5f5f5', primaryColor: '#000' },
    { team: 'Team 7', total: 720, balance: 210, bg: 'white', primaryColor: '#333' },
    { team: 'Team 8', total: 780, balance: 180, bg: '#fafafa', primaryColor: '#555' }
  ];

  constructor(private dialog: MatDialog,
              private playerService: PlayerService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    // this.getPlayers();
  }

  toggleTokenSelection(token: number) {
    if (this.selectedTokens.includes(token)) {
      this.selectedTokens = this.selectedTokens.filter(t => t !== token);
    } else {
      this.selectedTokens.push(token);
    }
  }

  async getPlayers() {
    try {
      this.loading = true;
      this.players = await this.playerService.getPlayers();
    } catch (error: any) {
      this.loading = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.loading = false;
    }
  }

  openPlayerOverviewDialog(player?:Player): void {
    const dialogRef = this.dialog.open(PlayerOverviewComponent, {
      width: '400px',
      data: {player}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.type === 'success') {
        this.getPlayers();
      }
    });
  }

}
