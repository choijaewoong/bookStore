ctrl.book = {
    convertRow2Obj : function(bookRow) {
        var book = new model.book(bookRow);
        return book;
    },
    loadAll : function() {
        var i = 0, 
            key = "", 
            keys = [], 
            bookTableString = "", 
            bookTable = {};
        try {
            if(localStorage["bookTable"]) {
                bookTableString = localStorage["bookTable"];
            }
        } catch(e) {
            alert("Error when reading from Local Storage\n" + e);
        }
        if(bookTableString) {
            bookTable = JSON.parse(bookTableString);
            keys = Object.keys(bookTable);
            console.log(keys.length + "books loaded.");
            for(i=0; i<keys.length; i++) {
                key = keys[i];
                model.books[key] = ctrl.book.convertRow2Obj(bookTable[key]);
            }
        }
    },
    saveAll : function() {
        var bookTableString = "", 
            error = false,
            numOfBooks = Object.keys(model.books).length;
        try {
            bookTableString = JSON.stringify(model.books);
            localStorage["bookTable"] = bookTableString;
        } catch(e) {
            alert("Error when writing to Local Storage\n" + e);
            error = true;
        }
        if(!error) console.log(numOfBooks + " books saved");
    },
    add : function(slots) {
        var book = new model.book(slots);
        model.books[slots.isbn] = book;
        ctrl.book.saveAll();
        console.log("Book " + slots.isbn + " created!");
    },
    // Updating an existing Book instance
    update : function(slots) {
        var book = model.books[slots.isbn];
        var year = parseInt(slots.year);
        if(book.title !== slots.title) {
            book.title = slots.title;
        }
        if(book.year !== year) {
            book.year = year;
        }
        ctrl.book.saveAll();
        console.log("Book " + slots.isbn + " modified");
    },
    // Deleting an existing Book instance
    destroy : function(isbn) {
        if(model.books[isbn]) {
            delete model.books[isbn];
            ctrl.book.saveAll();
            console.log("Book " + isbn + " deleted");
        } else {
            console.log("There is no book with ISBN " + isbn + " in the database!");
        }
    },
    // Clearing all data
    clearData : function() {
        if(confirm("Do you really want to delete all book data?")) {
            localStorage["bookTable"] = "{}";
        }
    },
    // Test data
    createTestData : function() {
        model.books["006251587X"] = new model.book({isbn:"006251587X", title:"Weaving the Web", year:2000});
        model.books["0465026567"] = new model.book({isbn:"0465026567", title:"Gödel, Escher, Bach", year:1999});
        model.books["0465030793"] = new model.book({isbn:"0465030793", title:"I Am A Strange Loop", year:2008});
        ctrl.book.saveAll();
    }
}