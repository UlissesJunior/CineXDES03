import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTextSubject = new BehaviorSubject<string>('');
  searchText$ = this.searchTextSubject.asObservable();

  emitSearchText(searchText: string): void {
    this.searchTextSubject.next(searchText);
  }

  getLastSearchText(): string {
    return this.searchTextSubject.getValue();
  }
}