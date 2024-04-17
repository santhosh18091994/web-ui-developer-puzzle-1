import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });

    it('should remove subscriptions and clear when leave page', () => {
      const unsubscribeSpy = jest.spyOn(effects.destroyed$, 'unsubscribe');
      effects.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
  
  describe('addToReadingList$', () => {
    it('should work add book from reading list', done => {
      actions = new ReplaySubject();
      const book = createBook('A');
      actions.next(ReadingListActions.addToReadingList({book}));
      effects.addBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({book})
        );
        done()
      });

      httpMock.expectOne(`/api/reading-list`).flush({book});
    });
  })

  describe('removeToReadingList$', () => {
    it('should work remove book from reading list', done => {
      actions = new ReplaySubject();
      const item= createReadingListItem('A');
      actions.next(ReadingListActions.removeFromReadingList({item}));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({item})
        );
        done()
      });

      httpMock.expectOne(`/api/reading-list/${item.bookId}`).flush({item});
    });
  })
});
