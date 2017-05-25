pl.view.index = {
    setupUserInterface: function() {
        var bookList = document.querySelector('.list-book');
        var keys=[], key="", row={}, i=0;
        Book.loadAll();
        keys= Object.keys(Book.instances);
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            var listItem = document.createElement('li');
            listItem.className = 'list-item-book';
            listItem.innerHTML = pl.view.index.templateListItem(Book.instances[key].isbn,
                                                  Book.instances[key].title,
                                                  Book.instances[key].year);
            bookList.appendChild(listItem);
        }

        // create add item form
        var addButton = document.getElementById('btn-add-book');
        addButton.addEventListener('click',
            pl.view.index.createInputForm);
    },
    templateListItem : function(isbn, title, year) {
        return '<span class="field-isbn">' + isbn + '</span>\
                <span class="field-title">' + title + '</span>\
                <span class="field-year">' + year + '</span>';
    },
    handleSaveButtonClickEvent: function() {
        var itemform = document.getElementById('formAddItem');
        var slots = { isbn: itemform.isbn.value,
                      title: itemform.title.value,
                      year: itemform.year.value };
        Book.add(slots);
        itemform.reset();        
    },
    createInputForm: function() {
        if(document.getElementById('formAddItem') !== null) return;
        var bookList = document.querySelector('.list-book');
        var addForm = document.createElement('li');
        addForm.className = 'list-item-book';
        addForm.innerHTML = pl.view.index.templateAddForm();
        bookList.appendChild(addForm);

        // define save button
        var saveButton = document.getElementById('btnSaveItem');
        saveButton.addEventListener("click",
            pl.view.index.handleSaveButtonClickEvent);
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
    },
    templateAddForm : function() {
        return '<form id="formAddItem" class="form-add-item">\
                    <label class="label-isbn" for="isbn"><input id="isbn" class="field-input" type="text"></label>\
                    <label class="label-title" for="title"><input id="title" class="field-input" type="text"></label>\
                    <label class="label-year" for="year"><input id="year" class="field-input" type="text"></label>\
                    <button id="btnSaveItem" class="btn-primary btn-submit" type="submit">Add</button>\
                </form>';
    }
}