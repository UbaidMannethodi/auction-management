import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class TeamStatusPdfGeneratorService {

  public loading = false;

  /** Image cache to avoid loading same URL multiple times */
  private imageCache = new Map<string, string>();

  constructor() {}

  /**
   * Generate Football Auction PDF
   */
  async generateAuctionReport(teams: any[]): Promise<void> {
    this.loading = true;

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const marginX = 10;
      let y = 20;

      /* ================= HEADER ================= */
      const logoBase64 = await this.getBase64FromUrlOriginal(
        '/images/icons/universal_upl_logo.png'
      );

      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', marginX, y - 5, 20, 20);
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('UNIVERSAL ARTS & SPORTS', pageWidth / 2, y + 2, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(' PREMIER LEAGUE MEGA AUCTION 2025', pageWidth / 2, y + 10, { align: 'center' });

      y += 20;
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 10;

      /* ================= POSITION PRIORITY ================= */
      const positionPriority: Record<string, number> = {
        goalkeeper: 3,
        defender: 2,
        forward: 1,
      };

      /* ================= TEAMS ================= */
      for (let t = 0; t < teams.length; t++) {
        const team = teams[t];

        // Start every team (except first) on new page
        if (t !== 0) {
          doc.addPage();
          y = 20;
        }

        /* ===== TEAM HEADER ===== */
        doc.setFillColor(team.primaryColor || '#eeeeee');
        doc.rect(marginX, y - 7, pageWidth - marginX * 2, 14, 'F');

          // Team logo (small & clean)
        if (team?.logo) {
          const teamLogo = await this.getBase64FromUrlOriginal(team.logo);
          if (teamLogo) {
            doc.addImage(teamLogo, 'PNG', marginX + 4, y - 6, 12, 12);
          }
        }

// Team name
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(team.name.toUpperCase(), pageWidth / 2, y + 3, {
          align: 'center'
        });

        y += 20;

        /* ===== MANAGER ===== */
        doc.setFontSize(12);
        doc.text('Manager', marginX, y);
        y += 6;

        if (team.manager?.image) {
          const managerImg = await this.getBase64FromUrlOriginal(team.manager.image);
          if (managerImg) {
            doc.addImage(managerImg, 'JPEG', marginX, y, 18, 18);
          }
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(team.manager?.name || '-', marginX + 25, y + 12);

        y += 26;

        /* ===== TABLE HEADER ===== */
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Photo', 12, y);
        doc.text('Name', 35, y);
        doc.text('Position', 80, y);
        doc.text('Price', 115, y);
        doc.text('Phone', 150, y);

        y += 4;
        doc.line(marginX, y, pageWidth - marginX, y);
        y += 6;

        /* ===== SORT PLAYERS ===== */
        const players = [...team.players].sort((a, b) => {
          if (a.isCaptain && !b.isCaptain) return -1;
          if (!a.isCaptain && b.isCaptain) return 1;
          return (positionPriority[a.position] || 99) -
            (positionPriority[b.position] || 99);
        });

        /* ===== LOAD PLAYER IMAGES IN PARALLEL ===== */
        const images = await Promise.all(
          players.map(p =>
            p.image ? this.getBase64FromUrlOriginal(p.image) : null
          )
        );

        /* ===== PLAYER ROWS ===== */
        doc.setFont('helvetica', 'normal');

        for (let i = 0; i < players.length; i++) {
          const p = players[i];

          if (y > pageHeight - 25) {
            doc.addPage();
            y = 20;
          }

          if (images[i]) {
            doc.addImage(images[i]!, 'JPEG', 12, y - 4, 14, 14);
          }

          doc.text(p.name, 35, y + 4);
          doc.text(p.position.toUpperCase(), 80, y + 4);
          doc.text(`Rs. ${Number(p.price || 0).toLocaleString('en-IN')}`, 115, y + 4);
          doc.text(
            p.phone && p.phone.trim() ? `+91 ${p.phone}` : '-',
            150,
            y + 4
          );

          if (p.isCaptain) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 128, 0);
            doc.text('CAPTAIN', pageWidth - 30, y + 4);
            doc.setTextColor(0);
            doc.setFont('helvetica', 'normal');
          }

          y += 16;
        }
      }

      doc.save('universal-UPL-auction-team-2025.pdf');

    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Convert image URL to Base64, resize, and cache
   */
  private async getBase64FromUrlOriginal(url: string): Promise<string> {
    if (this.imageCache.has(url)) return this.imageCache.get(url)!;

    try {
      const res = await fetch(url, { mode: 'cors' });
      const blob = await res.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          this.imageCache.set(url, base64);
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn('Failed to fetch image:', url);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBg4/67O0AAAAASUVORK5CYII=';
    }
  }
}
