Accessbility light house - issues
---------------------------
- Color contrast ratio of text should be at least 4.5:1 - Fixed for ".empty>p" element in book-search.component.scss (fixed)
- button elements should have "aria-label" attribute for better accessbility - Fixed for buttons in book-search.component.html (fixed)

Accessbility Manual issues
---------------------------
  book-search.component.html (Fixed)
    - image tag should contain 'alt' attribute for better accessbility
        - .book--content--cover >img, reading-list-item--cover elements dont have alt attribute
    - headings has to be wrapped in h1-h6 tags for better accessbility
    - Always use proper variable names.

  reading-list.component.scss (Fixed)
    - As ".reading-list-item--cover, .reading-list-item--details, .reading-list-item--actions" are child elements of '.reading-list-item' so css should be nested under parent


Code smell  & Problems
---------------------------------------------
reading-list-reducer.spec.ts (Fixed)
 - Implementation is missing for Test Case 
    (failedAddToReadingList should undo book addition to the state) & 
    (failedRemoveFromReadingList should undo book removal from the state)

reading-list.reducer.ts (Fixed)
  - Reducers are missing for failedRemoveFromReadingList

- Test Cases missing for some component
- Exceptions were not handled for the get ReadingList API
- Exceptions were not handled for the addToReadingList API


Improvements
---------------------------------------------
- Input field can be validated and stop triggering search for bad inputs.
- There are few places where unsubscribe is missing for subscriptions   created in ngOnInit. Which could potentially caused memory leaks.(Fixed)