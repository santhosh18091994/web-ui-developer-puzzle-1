import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestingModule } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { ReadingListItem } from '@tmo/shared/models';
import { Store } from '@ngrx/store';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let store: Store;
  let fixture: ComponentFixture<ReadingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should dispatch markAsFinish', () => {
    const item:ReadingListItem = {
      bookId:"erwer", 
      title:"demo title", 
      authors:[], 
      description:"",
       finished:true,
      finishedDate: new Date().toISOString()
    }
    spyOn(store, 'dispatch');
    component.markAsFinishedFromReadingList(item);
    expect(store.dispatch).toBeCalledTimes(1);
  })
});
