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

        // create radio button for update book
        var updateButton = document.getElementById('btnUpdateBook');
        updateButton.addEventListener('click', 
            function() { pl.view.index.createInputRadio(keys)});
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
    handleUpdateButtonClickEvent: function() {
        var itemform = document.getElementById('formUpdateItem');
        var slots = {isbn: itemform.isbn.value,
                     title: itemform.title.value,
                     year: itemform.year.value
                    };
        Book.update(slots);
        optionEl = selectBookEl.querySelector("option[value='" + slots.isbn +"']");
        optionEl.text = slots.title;
        optionEl.year = slots.year;
        formEl.reset();
    },
    createInputForm: function() {
        if(document.getElementById('formAddItem') !== null) return;
        var updateForm = document.getElementById('formUpdateItem');
        if(updateForm !== null) {
            updateForm.parentElement.remove();
            var radioForm = document.querySelector('.form-radio');
            radioForm.remove();
        }
        var bookList = document.querySelector('.list-book');
        var addForm = document.createElement('li');
        addForm.className = 'list-item-book';
        addForm.innerHTML = pl.view.index.templateAddForm();
        bookList.appendChild(addForm);
        var cancelButton = document.getElementById('btnCancel');
        cancelButton.addEventListener('click', function() {
            this.parentElement.parentElement.remove();
        });

        // define save button
        var saveButton = document.getElementById('btnSaveItem');
        saveButton.addEventListener("click",
            pl.view.index.handleSaveButtonClickEvent);
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
    },
    createUpdateForm: function() {
        // if(document.getElementById('formUpdateItem') !== null) return;
        var addForm = document.getElementById('formAddItem');
        if(addForm !== null) {
            addForm.parentElement.remove();
        }
        var bookList = document.querySelector('.list-book');
        var updateForm = document.createElement('li');
        updateForm.className = 'list-item-book';
        updateForm.innerHTML = pl.view.index.templateUpdateForm();
        bookList.appendChild(updateForm);
        var cancelButton = document.getElementById('btnCancel');
        cancelButton.addEventListener('click', function() {
            this.parentElement.parentElement.remove();
            var radioForm = document.querySelector('.form-radio');
            radioForm.remove();
        });

        // define save button
        var updateButton = document.getElementById('btnUpdateItem');
        updateButton.addEventListener("click",
            pl.view.index.handleUpdateButtonClickEvent);
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
    },
    createInputRadio: function(keys) {        
        if(document.querySelector('.form-radio') !== null) return;
        var container = document.querySelector('.contents-main');
        var form = document.createElement('form');
        form.className = 'form-radio';
        container.appendChild(form);
        for(i=0; i<keys.length; i++){
            key = keys[i];
            book = Book.instances[key];
            radio = document.createElement("input");
            radio.className = 'input-radio';
            radio.type = "radio";
            radio.name = "book";
            radio.value = book.isbn;
            form.appendChild(radio);
        }
        pl.view.index.createUpdateForm();
        var radios = document.querySelectorAll('.input-radio');
        Array.prototype.forEach.call(radios, function(radio) {
            radio.addEventListener('change', function() {
                book = Book.instances[this.value];                
                pl.view.index.textUpdateForm(book.isbn, book.title, book.year);
            });
        });
    },
    textUpdateForm: function(isbn, title, year) {
        var isbnInput = document.querySelector('#formUpdateItem #isbn');
        var titleInput = document.querySelector('#formUpdateItem #title');
        var yearInput = document.querySelector('#formUpdateItem #year');
        isbnInput.value = isbn;
        titleInput.value = title;
        yearInput.value = year;
        console.log(title);
    },
    clearForm: function() {

    },
    templateAddForm : function() {
        return '<form id="formAddItem" class="form-add-item">\
                    <label class="label-isbn" for="isbn"><input id="isbn" class="field-input" type="text"></label>\
                    <label class="label-title" for="title"><input id="title" class="field-input" type="text"></label>\
                    <label class="label-year" for="year"><input id="year" class="field-input" type="text"></label>\
                    <button id="btnCancel" class="btn-red btn-submit" type="submit">cancel</button>\
                    <button id="btnSaveItem" class="btn-blue btn-submit" type="submit">Add</button>\
                </form>';
    },
    templateUpdateForm : function() {
        return '<form id="formUpdateItem" class="form-add-item">\
                    <label class="label-isbn" for="isbn"><input id="isbn" class="field-input" type="text" readonly></label>\
                    <label class="label-title" for="title"><input id="title" class="field-input" type="text"></label>\
                    <label class="label-year" for="year"><input id="year" class="field-input" type="text"></label>\
                    <button id="btnCancel" class="btn-red btn-submit" type="submit">cancel</button>\
                    <button id="btnUpdateItem" class="btn-brown btn-submit" type="submit">update</button>\
                </form>';
    }
}