import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  const storeSpy: any = {
    dispatch: jest.fn(),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('dispatches the searchBooks action with the correct payload', () => {
    component.searchBooks();
    expect(storeSpy.dispatch).toBeTruthy();
  });

  it('dispatches the searchBooks action when type in input', fakeAsync(async () => {
      const searchInput = { nativeElement: document.createElement('input') };
      const searchBooksMock = jest.spyOn(component, 'searchBooks');
      const event = new Event('keyup');
      searchInput.nativeElement.value = 'test';
      searchInput.nativeElement.dispatchEvent(event);
      expect(searchBooksMock).toBeTruthy();
    })
  )

  it('should remove subscriptions and clear when leave page', () => {
    const unsubscribeSpy = jest.spyOn(component.componentDestroyed$, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
