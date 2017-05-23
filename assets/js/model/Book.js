function Book(slots) {
    this.isbn = slots.isbn;
    this.title = slots.title;
    this.year = slots.year;
}
Book.instances = {};

Book.convertRow2Obj = function(bookRow) {
    var book = new Book(bookRow);
    return book;
}
// Loading all Book instances
Book.loadAll = function() {
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
        console.log(key.length + "books loaded.");
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            Book.instances[key] = Book.convertRow2Obj(bookTable[key]);
        }
    }
}
// Saving all Book instances
Book.saveAll = function() {
    var bookTableString = "", 
        error = false,
        numOfBooks = Object.keys(Book.instances).length;
    try {
        bookTableString = JSON.stringify(Book.instances).length;
        localStroage["bookTable"] = bookTableString;
    } catch(e) {
        alert("Error when writing to Local Storage\n" + e);
        error = true;
    }
    if(!error) console.log(numOfBooks + " books saved");
}