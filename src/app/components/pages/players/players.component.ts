import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
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
import {TeamService} from "../../../services/team/team.service";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    MatButton,
    NgxLoadingModule,
    FormsModule,
    MatIcon,
    NgIf
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements OnInit {

  positions = DataUtils.playerPositions;
  loading = false;

  searchTerm: string = '';
  selectedPosition: string = '';

  constructor(private dialog: MatDialog,
              public playerService: PlayerService,
              public teamService: TeamService,
              private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getPlayers();
  }

  async getPlayers(forceFetch?: boolean, showLoader = true) {
    try {
      if (showLoader) {
        this.loading = true;
      }
      if (!this.playerService?.players?.length || forceFetch) {
        this.playerService.players = await this.playerService.getPlayers();
      }
      this.playerService.players = this.playerService.players.sort((a, b) => a.tokenNo - b.tokenNo);
    } catch (error: any) {
      this.loading = false;
      this.toastr.error(error, 'Something went wrong.');
    } finally {
      this.loading = false;
    }
  }

  get filteredPlayers() {
    return this.playerService.players.filter(player =>
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
      this.updateTeamWhenPlayerUpdate(player.id);
      this.playerService.players = this.playerService.players.filter(p => p.id !== player.id);
      this.getPlayers(true, true);
      this.loading = false;
    }
  }

  async updateTeamWhenPlayerUpdate(playerId: string) {
    await this.teamService.updateTeamWhenPlayerUpdate(playerId);
    this.teamService.teams = await this.teamService.getTeam();
  }

  getPosition(positionID: string): string {
    const positions = DataUtils.playerPositions;
    return positions.find( position => position.id === positionID)?.name
  }

  generatePDF() {
    const doc = new jsPDF();

    // Define position order and titles
    const positionOrder = ['captain', 'goalkeeper', 'defender', 'forward'];
    const positionTitles: { [key: string]: string } = {
      captain: 'Captains',
      goalkeeper: 'Goal keepers',
      defender: 'Defenders',
      forward: 'Forwards',
    };

    // Title for the document (bold)
    doc.setFont('Helvetica', 'bold'); // Set font to bold
    doc.text('UPL Players List', 14, 10);
    doc.setFont('Helvetica', 'normal'); // Reset font back to normal
    let yPosition = 40; // Initial Y position for adding content

    // Group players by position including captain
    for (const position of positionOrder) {
      let playersByPosition = [];

      // Filter players based on position
      if (position === 'captain') {
        playersByPosition = this.playerService.players.filter(player => player.isCaptain);
      } else {
        playersByPosition = this.playerService.players.filter(player =>  (player.position).toLowerCase() === position.toLowerCase());
      }

      // Debugging log to check the filtered players
      console.log(`Position: ${position}`, playersByPosition); // Log the players for this position

      // Skip if no players for this position
      if (playersByPosition.length === 0) continue;

      // Add a header for each position
      doc.text(positionTitles[position], 14, yPosition);
      yPosition += 10; // Space between heading and table

      // Prepare data for each position's players with serial numbers
      const tableData = playersByPosition.map((player, index) => [
        (index + 1).toString(), // Serial Number (1-based index)
        player.name,
        ''
      ]);

      // Add table for the position
      autoTable(doc, {
        head: [['SI No', 'Name', 'Remark']], // Updated header to include SI No
        body: tableData,
        startY: yPosition,
        theme: 'striped',
        columnStyles: {
          0: { cellWidth: 20 }, // Width for SI No column
          1: { cellWidth: 50 }, // Width for Name column
          2: { cellWidth: 100 }, // Width for Remark column (larger)
        },
      });

      yPosition = doc.lastAutoTable.finalY + 10; // Update Y position for next section
    }

    // Save the PDF
    doc.save('UPL_2024_players_list.pdf');
  }

  openAddPlayerDialog(player?:Player): void {
    const editMode = !!player
    const dialogRef = this.dialog.open(PlayerFormComponent, {
      width: '400px',
      data: {editMode, player, totalPlayers: this.playerService.players?.length}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.type === 'success') {
        this.getPlayers(true);
      }
    });
  }


}
