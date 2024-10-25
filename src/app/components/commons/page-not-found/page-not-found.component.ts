import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    RouterLink
  ],
  template:
    `
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-800">404</h1>
        <p class="mt-4 text-lg text-gray-600">Oops! The page you're looking for doesn't exist.</p>
        <a routerLink="/" class="mt-6 inline-block px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
          Go Back Home
        </a>
      </div>
    </div>
  `,
  styles: ['']
})
export class PageNotFoundComponent {

}
