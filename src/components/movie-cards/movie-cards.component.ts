import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'movie-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-cards.component.html',
  styleUrls: ['./movie-cards.component.scss'],
})
export class MovieCardsComponent {
  @Input() movies: any[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  onPageChange(newPage: number): void {
    this.pageChange.emit(newPage);
  }
}
