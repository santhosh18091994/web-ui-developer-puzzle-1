import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getReadingList,
  ReadingListBook,
  searchBooks,
  undoAction
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  lastAdded:ReadingListItem;
  finishedBooks: any;
  public componentDestroyed$ = new Subject();
  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books.sort((a, b) => (a.title < b.title ? -1 : 1));;
    });
    this.store.select(getReadingList).subscribe(books => {
      this.finishedBooks = books.filter(el => el.finished).map(el=>el.bookId);
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    const bookAddedSnackbar = this.snackBar.open('Book Added into Reading List', 'Undo',{
      duration:2000
    });
    bookAddedSnackbar.onAction().pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
      this.store.dispatch(undoAction())
    });
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  ngOnDestroy(){
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.unsubscribe();
  }
}
