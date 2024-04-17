import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of, Subject } from 'rxjs';
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

  finishBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.markAsFinish),
      takeUntil(this.destroyed$),
      concatMap(({ item }) =>
        this.http.put(`/api/reading-list/${item.bookId}/finished`,item).pipe(
          map(() =>
            ReadingListActions.confirmedMarkAsFinish({ item })
          ),
          catchError(() =>
            of(ReadingListActions.failedMarkAsFinish({ item }))
          )
        )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  ngOnDestroy(){
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
