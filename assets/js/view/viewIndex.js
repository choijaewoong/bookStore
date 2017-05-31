pl.view.index = {
    setupUserInterface: function() {
        var bookList = document.querySelector('.list-book');
        var keys=[], key="";
        Book.loadAll();
        keys= Object.keys(Book.instances);
        for(var i=0; i<keys.length; i++) {
            key = keys[i];
            var listItem = document.createElement('li');
            listItem.className = 'list-item-book';
            listItem.innerHTML = pl.view.index.templateListItem(Book.instances[key].isbn,
                                                                Book.instances[key].title,
                                                                Book.instances[key].year);
            bookList.appendChild(listItem);
        }

        // create form and submit button for add
        var addButton = document.getElementById('btnAddbook');
        addButton.addEventListener('click',
            pl.view.index.createAddForm);

        // create radio button and submit button for update
        var updateButton = document.getElementById('btnUpdateBook');
        updateButton.addEventListener('click', 
            function() { pl.view.index.createUpdateForm(keys)});
        
        // create select box and submit button for button
        var deleteButton = document.getElementById('btnDeleteBook');
        deleteButton.addEventListener('click',
            function() { pl.view.index.createDeleteForm(keys)});
    },
    submitAddBook: function(bookList) {
        // update storage
        var addForm = document.getElementById('formAddItem');
        var slots = { isbn: addForm.isbn.value,
                      title: addForm.title.value,
                      year: addForm.year.value };
        Book.add(slots);
        // add list
        var listItem = document.createElement('li');
        listItem.className = 'list-item-book';
        listItem.innerHTML = pl.view.index.templateListItem(slots.isbn,
                                                            slots.title,
                                                            slots.year);
        bookList.appendChild(listItem);
        // remove form
        addForm.parentElement.remove();
    },
    submitUpdateBook: function(radioForm) {
        // update storage
        var updateForm = document.getElementById('formUpdateItem'); 
        var slots = { isbn: updateForm.isbn.value,
                      title: updateForm.title.value,
                      year: updateForm.year.value };
        Book.update(slots);
        // update list
        var updateList = document.querySelector('.field-isbn[data-isbn="' + updateForm.isbn.value + '"').parentElement;
        updateList.querySelector('.field-title').innerHTML = slots.title;
        updateList.querySelector('.field-year').innerHTML = slots.year;
        // remove form
        radioForm.remove();
        updateForm.parentElement.remove();
    },
    submitDeleteBook: function(bookArr, deleteForm, checkboxForm) {
        // update storage AND update list
        for(var i=0; i<bookArr.length; i++) {
            Book.destroy(bookArr[i]);
            var deleteList = document.querySelector('.field-isbn[data-isbn="' + bookArr[i] + '"').parentElement;
            deleteList.remove();
        }
        // remove form
        deleteForm.remove();
        checkboxForm.remove();
    },
    createAddForm: function() {
        // prevent duplicate form
        if(document.getElementById('formAddItem') !== null) return;

        pl.view.index.clearOtherForm();

       
        var bookList = document.querySelector('.list-book');
        bookList.innerHTML += pl.view.index.templateAddForm();

        // submit add button
        var submitButton = document.getElementById('btnAddSubmit');
        submitButton.addEventListener("click", function() {
            pl.view.index.submitAddBook(bookList);
        });
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
        
        var cancelButton = document.getElementById('btnAddCancel');
        cancelButton.addEventListener('click', function() {
            this.parentElement.parentElement.remove();
        });
    },    
    createUpdateForm: function(keys) {
        // prevent duplicate form
        if(document.querySelector('.form-radio') !== null) return;

        var container = document.querySelector('.contents-main');
        var radioForm = document.createElement('form');
        radioForm.className = 'form-radio';
        container.appendChild(radioForm);

        pl.view.index.createUpdateTextForm(radioForm);
        var keys= Object.keys(Book.instances);
        for(var i=0; i<keys.length; i++){
            key = keys[i];
            book = Book.instances[key];
            radio = document.createElement("input");
            radio.className = 'input-radio';
            radio.type = "radio";
            radio.name = "book";
            radio.value = book.isbn;
            radio.addEventListener('change', function() {
                book = Book.instances[this.value];                
                pl.view.index.textUpdateForm(book.isbn, book.title, book.year);
            });
            radioForm.appendChild(radio);
        }
    },
    createUpdateTextForm: function(radioForm) {
        // prevent duplicate form
        if(document.getElementById('formUpdateItem') !== null) return;

        var addForm = document.getElementById('formAddItem');
        if(addForm !== null) {
            addForm.parentElement.remove();
        }

        var bookList = document.querySelector('.list-book');
        bookList.innerHTML += pl.view.index.templateUpdateTextForm();

        // submit update button
        var updateButton = document.getElementById('btnUpdateSubmit');
        updateButton.addEventListener("click", function() {
            pl.view.index.submitUpdateBook(radioForm);
        });
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });

        var cancelButton = document.getElementById('btnUpdateCancel');
        cancelButton.addEventListener('click', function() {
            this.parentElement.parentElement.remove();
            radioForm.remove();
        });
    },
    createDeleteForm: function(keys) {
        // prevent duplicate form
        if(document.querySelector('.form-checkbox') !== null) return;

        var container = document.querySelector('.contents-main');
        var checkboxForm = document.createElement('form');        
        checkboxForm.className = 'form-checkbox';
        container.appendChild(checkboxForm);
        var bookArr = [];
        var keys= Object.keys(Book.instances);
        for(var i=0; i<keys.length; i++){
            key = keys[i];
            book = Book.instances[key];
            checkbox = document.createElement("input");
            checkbox.className = 'input-check';
            checkbox.type = "checkbox";
            checkbox.name = "book";
            checkbox.value = book.isbn;
            checkbox.addEventListener('change', function() {
                if(this.checked) {
                    bookArr.push(this.value);
                } else {
                    bookArr.splice(bookArr.indexOf(this.value), 1);
                }
            });
            checkboxForm.appendChild(checkbox);
        }
        pl.view.index.createDeleteSubmitButton(bookArr, checkboxForm);
    },
    createDeleteSubmitButton: function(bookArr, checkboxForm) {
        var bookList = document.querySelector('.list-book');

        bookList.innerHTML += pl.view.index.templateDeleteSubmitButton();
        
        var cancelButton = document.getElementById('btnDeleteCancel');
        cancelButton.addEventListener('click', function() {
            this.parentElement.remove();
            checkboxForm.remove();
        });
        var submitButton = document.getElementById('btnDeleteSubmit');
        submitButton.addEventListener('click', function() {
            pl.view.index.submitDeleteBook(bookArr, this.parentElement, checkboxForm);
        });
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
    },
    clearOtherForm: function() {
        var updateForm = document.getElementById('formUpdateItem');
        if(updateForm !== null) {
            updateForm.parentElement.remove();
            var radioForm = document.querySelector('.form-radio');
            radioForm.remove();
        }
    },
    textUpdateForm: function(isbn, title, year) {
        var updateForm = document.getElementById('formUpdateItem');
        updateForm.isbn.value = isbn;
        updateForm.title.value = title;
        updateForm.year.value = year;
    },
    templateListItem : function(isbn, title, year) {
        return '<span class="field-isbn" data-isbn="' + isbn + '">' + isbn + '</span>\
                <span class="field-title">' + title + '</span>\
                <span class="field-year">' + year + '</span>';
    },
    templateAddForm : function() {
        return '<li class="list-item-book">\
                    <form id="formAddItem" class="form-add-item">\
                        <label class="label-isbn" for="isbn"><input id="isbn" class="field-input" type="text"></label>\
                        <label class="label-title" for="title"><input id="title" class="field-input" type="text"></label>\
                        <label class="label-year" for="year"><input id="year" class="field-input" type="text"></label>\
                        <button id="btnAddCancel" class="btn-red btn-submit" type="button">cancel</button>\
                        <button id="btnAddSubmit" class="btn-blue btn-submit" type="button">Add</button>\
                    </form>\
                </li>';
    },
    templateUpdateTextForm : function() {
        return '<li class="list-item-book">\
                    <form id="formUpdateItem" class="form-add-item">\
                        <label class="label-isbn" for="isbn"><input id="isbn" class="field-input" type="text" readonly></label>\
                        <label class="label-title" for="title"><input id="title" class="field-input" type="text"></label>\
                        <label class="label-year" for="year"><input id="year" class="field-input" type="text"></label>\
                        <button id="btnUpdateCancel" class="btn-red btn-submit" type="button">cancel</button>\
                        <button id="btnUpdateSubmit" class="btn-brown btn-submit" type="button">update</button>\
                    </form>\
                </li>';
    },
    templateDeleteSubmitButton: function() {
        return '<li class="list-item-book">\
                    <button id="btnDeleteCancel" class="btn-red btn-submit" type="button">cancel</button>\
                    <button id="btnDeleteSubmit" class="btn-red btn-submit" type="submit">delete</button>\
                </li>';
    }
}