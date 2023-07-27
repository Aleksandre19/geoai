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