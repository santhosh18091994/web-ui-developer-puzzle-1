import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Subject, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, takeUntil } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';

@Injectable()
export class ReadingListEffects implements OnInitEffects, OnDestroy {

  destroyed$:Subject<any> = new Subject();

  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          takeUntil(this.destroyed$),
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          takeUntil(this.destroyed$),
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError((error) =>
            of(ReadingListActions.failedAddToReadingList({ book, error }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          takeUntil(this.destroyed$),
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError((error) =>
            of(ReadingListActions.failedRemoveFromReadingList({ item, error }))
          )
        )
      )
    )
  );

  ngOnDestroy(){
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
