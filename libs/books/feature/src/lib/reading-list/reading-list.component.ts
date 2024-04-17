import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, undoAction } from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);
  public componentDestroyed$ = new Subject();
  
  constructor(private readonly store: Store, private snackBar: MatSnackBar) {}

  removeFromReadingList(item:ReadingListItem) {
    const bookAddedSnackbar = this.snackBar.open('Book Removed from Reading List', 'Undo',{
      duration:2000
    });
    bookAddedSnackbar.onAction().pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
      this.store.dispatch(undoAction())
    });
    this.store.dispatch(removeFromReadingList({ item }));
  }
}
