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

        // form event
        var addForm = document.getElementById('formAddItem');
        pl.view.index.registerAddSubmitEvent(addForm);
        
        var updateForm = document.getElementById('formUpdateItem');
        pl.view.index.registerUpdateSubmitEvent(updateForm);

        var deleteForm = document.getElementById('formDeleteItem');
        pl.view.index.registerDeleteSubmitEvent(deleteForm);

        // bottom button event
        var addButton = document.getElementById('btnAddbook');
        addButton.addEventListener('click', 
            function() { pl.view.index.createAddForm(addForm)});

        var updateButton = document.getElementById('btnUpdateBook');
        updateButton.addEventListener('click', 
            function() { pl.view.index.createUpdateForm(updateForm)});
        
        // create select box and submit button for button
        var deleteButton = document.getElementById('btnDeleteBook');
        deleteButton.addEventListener('click',
            function() { pl.view.index.createDeleteForm(deleteForm)});
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
                                                            parseInt(slots.year));
        var index = Object.keys(Book.instances).indexOf(slots.isbn);
        bookList.insertBefore(listItem, bookList.children[index]);
        // remove form
        addForm.reset();
        addForm.style.display = "none";
    },
    submitUpdateBook: function(updateForm) {
        // update storage
        var slots = { isbn: updateForm.isbn.value,
                      title: updateForm.title.value,
                      year: updateForm.year.value };
        Book.update(slots);
        // update list
        var updateList = document.querySelector('.field-isbn[data-isbn="' + updateForm.isbn.value + '"').parentElement;
        updateList.querySelector('.field-title').innerHTML = slots.title;
        updateList.querySelector('.field-year').innerHTML = parseInt(slots.year);
        // remove form
        updateForm.reset();
        updateForm.style.display = "none";
    },
    submitDeleteBook: function(deleteForm) {
        var bookArr = deleteForm.book;
        var deleteList = document.querySelector('.list-book');
        for(var i=bookArr.length-1; i>=0; i--) {
            if(bookArr[i].checked) {
                deleteItem = deleteList.children[i];
                deleteItem.remove();
                Book.destroy(deleteItem.querySelector('.field-isbn').innerHTML);
            }
        }
        deleteForm.reset();
        deleteForm.style.display = "none";
    },
    createAddForm: function(addForm) {
        if(addForm.style.display === "block") return;        
        pl.view.index.clearOtherForm();

        addForm.style.display = "block";
    },
    registerAddSubmitEvent: function(addForm) {
        var bookList = document.querySelector('.list-book');        
        // prevent duplicate form
        var submitButton = document.getElementById('btnAddSubmit');
        submitButton.addEventListener("click", function() {
            pl.view.index.submitAddBook(bookList);
        });
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
        var cancelButton = document.getElementById('btnAddCancel');
        cancelButton.addEventListener('click', function() {
            addForm.reset();
            addForm.style.display = "none";
        });
    },
    createUpdateForm: function(updateForm) {
        // prevent duplicate form        
        if(updateForm.style.display === "block") return;
        pl.view.index.clearOtherForm();

        updateForm.style.display = "block";

        var radioForm = updateForm.querySelector('.update-radio-wrapper');
        radioForm.innerHTML = '';
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
                pl.view.index.textUpdateForm(updateForm, book);
            });
            radioForm.appendChild(radio);
        }
    },
    registerUpdateSubmitEvent: function(updateForm) {
        // submit update button
        var updateButton = document.getElementById('btnUpdateSubmit');
        updateButton.addEventListener("click", function() {
            pl.view.index.submitUpdateBook(updateForm);
        });
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
        var cancelButton = document.getElementById('btnUpdateCancel');
        cancelButton.addEventListener('click', function() {
            updateForm.reset();
            updateForm.style.display = "none";
        });
    },
    createDeleteForm: function(deleteForm) {
        // prevent duplicate form        
        if(deleteForm.style.display === "block") return;
        pl.view.index.clearOtherForm();

        deleteForm.style.display = "block";

        var checkboxForm = deleteForm.querySelector('.delete-checkbox-wrapper');
        checkboxForm.innerHTML = '';   
        var keys= Object.keys(Book.instances);
        for(var i=0; i<keys.length; i++){
            key = keys[i];
            book = Book.instances[key];
            checkbox = document.createElement("input");
            checkbox.className = 'input-checkbox';
            checkbox.type = "checkbox";
            checkbox.name = "book";
            checkbox.value = book.isbn;
            checkboxForm.appendChild(checkbox);
        }
    },
    registerDeleteSubmitEvent: function(deleteForm) {
        var submitButton = document.getElementById('btnDeleteSubmit');
        submitButton.addEventListener('click', function() {
            pl.view.index.submitDeleteBook(deleteForm);
        });
        window.addEventListener("beforeunload", function() {
            Book.saveAll();
        });
        var cancelButton = document.getElementById('btnDeleteCancel');
        cancelButton.addEventListener('click', function() {
            deleteForm.reset();
            deleteForm.style.display = "none";
        });
    },
    clearOtherForm: function() {
        var addForm = document.getElementById('formAddItem');
        if(addForm.style.display === 'block') {
            addForm.style.display = 'none';
        }
        var updateForm = document.getElementById('formUpdateItem');
        if(updateForm.style.display === 'block') {
            updateForm.style.display = 'none';
        }
        var deleteForm = document.getElementById('formDeleteItem');
        if(deleteForm.style.display === 'block') {
            deleteForm.style.display = 'none';
        }
    },
    textUpdateForm: function(updateForm, book) {
        updateForm.isbn.value = book.isbn;
        updateForm.title.value = book.title;
        updateForm.year.value = book.year;
    },
    templateListItem : function(isbn, title, year) {
        return '<span class="field-isbn" data-isbn="' + isbn + '">' + isbn + '</span>\
                <span class="field-title">' + title + '</span>\
                <span class="field-year">' + year + '</span>';
    }
}