pl.view.bookList = {
    setupUserInterface: function() {
        var bookList = document.querySelector('.list-book');
        var keys=[], key="", row={}, i=0;
        Book.loadAll();
        keys= Object.keys(Book.instances);
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            var listItem = document.createElement('li');
            listItem.className = 'list-item-book';
            listItem.innerHTML = pl.view.bookList.templateListItem(Book.instances[key].isbn,
                                                  Book.instances[key].title,
                                                  Book.instances[key].year);
            bookList.appendChild(listItem);
        }
    },
    templateListItem : function(isbn, title, year) {
        return '<span class="field-isbn">' + isbn + '</span>\
                <span class="field-title">' + title + '</span>\
                <span class="field-year">' + year + '</span>';
    }
}