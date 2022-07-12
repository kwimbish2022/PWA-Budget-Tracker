let db;

// establish a connection
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {

    // save a reference to the database
    const db = event.target.result;

    // create an object store; auto incrementing primary key 
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

// success!
request.onsuccess = function(event) {

    db = event.target.result;

    if (navigator.onLine) {
        
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// there's no internet connection
function saveRecord(record) {

    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    // access the object store 
    const  budgetObjectStore = transaction.objectStore('new_transaction');

    // add record 
    budgetObjectStore.add(record);
}

function uploadTransaction() {

    
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    // access your object store
    const budgetObjectStore = transaction.objectStore('new_transaction');

    // get all records 
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {

        // send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    
                    const transaction = db.transaction(['new_transaction'], 'readwrite');

                    
                    const budgetObjectStore = transaction.objectStore('new_transaction');

                    // clear all items in your store
                    budgetObjectStore.clear();

                    alert('All saved transactions has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}


window.addEventListener('online', uploadTransaction);