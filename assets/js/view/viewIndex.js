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
    submitAddBook: function() {
        var addform = document.getElementById('formAddItem');
        var slots = { isbn: addform.isbn.value,
                      title: addform.title.value,
                      year: addform.year.value };
        Book.add(slots);
        // itemform.reset();
    },
    submitUpdateBook: function() {
        var updateform = document.getElementById('formUpdateItem');
        var slots = { isbn: updateform.isbn.value,
                      title: updateform.title.value,
                      year: updateform.year.value };
        Book.update(slots);
        // updateform.reset();
    },
    createAddForm: function() {
        if(document.getElementById('formAddItem') !== null) return;

        var updateForm = document.getElementById('formUpdateItem');
        if(updateForm !== null) {
            updateForm.parentElement.remove();
            var radioForm = document.querySelector('.form-radio');
            radioForm.remove();
        }
        
        var bookList = document.querySelector('.list-book');
        bookList.innerHTML += pl.view.index.templateAddForm();

        // submit add button
        var submitButton = document.getElementById('btnAddSubmit');
        submitButton.addEventListener("click",
            pl.view.index.submitAddBook);
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
        
        var cancelButton = document.getElementById('btnAddCancel');
        cancelButton.addEventListener('click', function() {
            this.parentElement.parentElement.remove();
        });
    },    
    createUpdateForm: function(keys) {        
        if(document.querySelector('.form-radio') !== null) return;

        var container = document.querySelector('.contents-main');
        var radioform = document.createElement('form');
        radioform.className = 'form-radio';
        container.appendChild(radioform);

        pl.view.index.createUpdateTextForm();

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
            radioform.appendChild(radio);
        }
    },
    createUpdateTextForm: function() {
        if(document.getElementById('formUpdateItem') !== null) return;

        var addForm = document.getElementById('formAddItem');
        if(addForm !== null) {
            addForm.parentElement.remove();
        }

        var bookList = document.querySelector('.list-book');
        bookList.innerHTML += pl.view.index.templateUpdateTextForm();

        // submit update button
        var updateButton = document.getElementById('btnUpdateSubmit');
        updateButton.addEventListener("click",
            pl.view.index.submitUpdateBook);
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });

        var cancelButton = document.getElementById('btnUpdateCancel');
        cancelButton.addEventListener('click', function() {
            this.parentElement.parentElement.remove();
            var radioForm = document.querySelector('.form-radio');
            radioForm.remove();
        });
    },
    createDeleteForm: function(keys) {
        if(document.querySelector('.form-delete') !== null) return;

        var container = document.querySelector('.contents-main');
        var deleteform = document.createElement('form');        
        deleteform.className = 'form-delete';
        container.appendChild(deleteform);
        
        var bookArr = [];
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
            deleteform.appendChild(checkbox);
        }
        pl.view.index.createDeleteSubmitButton(bookArr);
    },
    createDeleteSubmitButton: function(bookArr) {
        var bookList = document.querySelector('.list-book');

        bookList.innerHTML += pl.view.index.templateDeleteSubmitButton();
        
        var deleteForm = document.querySelector('.form-delete');
        var cancelButton = document.getElementById('btnDeleteCancel');
        cancelButton.addEventListener('click', function() {
            this.parentElement.parentElement.remove();
            deleteForm.remove();
        });
        var submitButton = document.getElementById('btnDeleteSubmit');
        submitButton.addEventListener('click', function() {
            for(var i=0; i<bookArr.length; i++) {
                Book.destroy(bookArr[i]);
            }
        });
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
    },
    textUpdateForm: function(isbn, title, year) {
        var updateForm = document.getElementById('formUpdateItem');
        updateForm.isbn.value = isbn;
        updateForm.title.value = title;
        updateForm.year.value = year;
        console.log(updateForm.isbn.value);
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
                        <button id="btnAddSubmit" class="btn-blue btn-submit" type="submit">Add</button>\
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
                        <button id="btnUpdateSubmit" class="btn-brown btn-submit" type="submit">update</button>\
                    </form>\
                </li>';
    },
    templateDeleteSubmitButton: function() {
        return '<li class="list-item-book">\
                    <form>\
                        <button id="btnDeleteCancel" class="btn-red btn-submit" type="button">cancel</button>\
                        <button id="btnDeleteSubmit" class="btn-red btn-submit" type="submit">delete</button>\
                    </form>\
                </li>';
    }
}