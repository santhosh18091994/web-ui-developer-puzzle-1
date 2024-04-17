import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as ReadingListActions from './reading-list.actions';
import { ReadingListItem } from '@tmo/shared/models';

export const READING_LIST_FEATURE_KEY = 'readingList';

export interface State extends EntityState<ReadingListItem> {
  loaded: boolean;
  error: null | string;
  stateHistory: State[];
}

export interface ReadingListPartialState {
  readonly [READING_LIST_FEATURE_KEY]: State;
}

export const readingListAdapter: EntityAdapter<ReadingListItem> = createEntityAdapter<
  ReadingListItem
>({
  selectId: item => item.bookId
});

export const initialState: State = readingListAdapter.getInitialState({
  loaded: false,
  error: null,
  stateHistory: []
});

const readingListReducer = createReducer(
  initialState,
  on(ReadingListActions.init, state => {
    return {
      ...state,
      loaded: false,
      error: null
    };
  }),
  on(ReadingListActions.loadReadingListSuccess, (state, action) => {
    return readingListAdapter.setAll(action.list, {
      ...state,
      loaded: true
    });
  }),
  on(ReadingListActions.loadReadingListError, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
  on(ReadingListActions.addToReadingList, (state, action) => {
    const newState = readingListAdapter.addOne({ bookId: action.book.id, ...action.book }, state);
    return { ...newState, stateHistory: [...state.stateHistory, { ...state }] };
  }),
  on(ReadingListActions.removeFromReadingList, (state, action) => {
    const newState = readingListAdapter.removeOne(action.item.bookId, state);
    return { ...newState, stateHistory: [...state.stateHistory, { ...state }] };
  }),
  on(ReadingListActions.failedAddToReadingList, (state, action) =>{
    readingListAdapter.removeOne(action.book.id, state)
      return {
        ...state,
        error: action.error
      };
    }
  ),
  on(ReadingListActions.failedRemoveFromReadingList, (state, action) =>{
    readingListAdapter.addOne({ bookId: action.item.bookId, ...action.item }, state)
    return {
      ...state,
      error: action.error
    };
  }),
  on(ReadingListActions.undoAction, (state) => {
    if (state.stateHistory.length > 0) {
      const previousState = state.stateHistory[state.stateHistory.length - 1];
      const updatedHistory = state.stateHistory.slice(0, -1); // Remove the last state from history
      return { ...previousState, stateHistory: updatedHistory };
    }
    return state;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return readingListReducer(state, action);
}
