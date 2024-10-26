import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {PlayerFormComponent} from "./player-form/player-form.component";
import {PlayerService} from "../../../services/players/player.service";
import {Player} from "../../../model/player";
import {NgxLoadingModule} from "ngx-loading";
import {ToastrService} from "ngx-toastr";
import {ConfirmDialogComponent} from "../../commons/confirm-dialog/confirm-dialog.component";
import {DataUtils} from "../../../utils/data-utils";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    MatButton,
    NgxLoadingModule,
    FormsModule
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements OnInit {

  players: Player[] = [];
  positions = DataUtils.playerPositions;
  loading = false;

  searchTerm: string = '';
  selectedPosition: string = '';

  constructor(private dialog: MatDialog,
              private playerService: PlayerService,
              private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getPlayers();
  }

  async getPlayers() {
    try {
      this.loading = true;
      this.players = await this.playerService.getPlayers();
      this.players = this.players.sort((a, b) => a.tokenNo - b.tokenNo);
    } catch (error: any) {
      this.loading = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.loading = false;
    }
  }

  get filteredPlayers() {
    return this.players.filter(player =>
      player.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedPosition ? player.position === this.selectedPosition : true)
    );
  }

  editPlayer(player: Player): void {
    this.openAddPlayerDialog(player);
  }

  openConfirmDialog(player: Player): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete <b>${player.name}</b>?`,
      },
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deletePlayer(player);
      }
    });
  }

  async deletePlayer(player: Player) {
    try {
      this.loading = true;
      await this.playerService.deletePlayer(player?.id);
    } catch (error: any) {
      this.loading = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.players = this.players.filter(p => p.id !== player.id);
      this.loading = false;
    }
  }

  getPosition(positionID: string): string {
    const positions = DataUtils.playerPositions;
    return positions.find( position => position.id === positionID)?.name
  }

  openAddPlayerDialog(player?:Player): void {
    const editMode = !!player
    const dialogRef = this.dialog.open(PlayerFormComponent, {
      width: '400px',
      data: {editMode, player, totalPlayers: this.players?.length}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.type === 'success') {
        this.getPlayers();
      }
    });
  }


}
