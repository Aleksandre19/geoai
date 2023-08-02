// To do:
// 1. New added topic title's edit action doesn't update the url in the address bar,
//    because of the following function:
      // if (curPage === origSlug)
        // window.history.pushState({}, '', newUrl);

// 2. Delete url from the address bar when the topic is deleted.

// START 2023-07-27
// 3. When topic title is deleted, on mouseleave the content of the deleted topic title
      // is appended to the next topic title.

// 4. There is a need to work around the updateUrl function in the titleActionBtn.js file.
      // It seems there is a need to update titleCont storage after title deletion.
      // Check this and fix it.

// 5. wrapp ellipsis with span tag in topic title.
// END 2023-07-27

// 6. By clicking on the title edit, the ellipsis should be hidden.

// 7. Refactor the titleActionBtn.js file.

// 8. On removing (partialy or fully) topic title, the span in the the content is removing as well.

// 9. Fixing ellipsis toggling problem on topic title.

// 10. Adjust the webSocket.js to the refactored titleActionBtn.js file.

// ============== HEAD

// 11. JSON formating for pygments package.

// 12. Improving response formatting.(`` wrapping this with span tag).

// 13. Create glossaries in Google Translate API.

// 14. Improve OpenAI Api plugin funnctionaliity.

// 15. Try to convert exiting python code to OOP wherever it is possible.

// 16. Implement text tokinizer calculator.

// 17. Logged in users basic UI. (Posiblly with dark mode).

// 18. Stripe Setup.

// 19. Not logged users basic UI.

// 20. Release 01.