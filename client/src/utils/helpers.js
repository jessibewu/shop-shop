export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

// when calling the function, will establish connection to the database, then connect to the object store that we pass in as storeName. 
//  Then we'll perform a transaction, using the method and object values to help carry it out
export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database `shop-shop` with the version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to the database, transaction (tx), and object store
    let db, tx, store;

    // if version has changed (or if this is the first time using the database), run this method and create the three object stores 
    request.onupgradeneeded = function(e) {
      const db = request.result;
      // create object store for each type of data and set "primary" key index to be the `_id` of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // handle any errors with connecting
    request.onerror = function(e) {
      console.log('There was an error');
    };

    // on database open success
    request.onsuccess = function(e) {
      // save a reference of the database to the `db` variable
      db = request.result;
      // open a transaction do whatever we pass into `storeName` (must match one of the object store names)
      // passing in the object store & the permissions we want in this transaction
      // storeName: 1 of the 3 stores we created for the database will be passed in as an argument in the idbPromise() function when we call it from a component
      tx = db.transaction(storeName, 'readwrite');
      // We'll save a reference to that object store so that we can perform a CRUD method (read/write/update data)
      store = tx.objectStore(storeName);

      // to check which value we passed into the function as a method and perform that method on the object store
      switch (method) {
        // run the .put() method on the object store, overwriting any data with the matching _id value from the object and adding it if it can't find a match
        //  Both put & get methods will return the data to whenever we call this idbPromise() 
        case 'put': // works in a find-or-create fashion: if it doesn't find the data to update, it will simply add that data
          store.put(object);
          resolve(object);
          break;
        // simply get all data from that store and return it
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        // delete that item from the object store. 
        //  This option will come in handy if users want to remove an item from the shopping cart while offline
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      // if there's any errors, let us know
      db.onerror = function(e) {
        console.log('error', e);
      };

      // when the transaction is complete, close the connection
      tx.oncomplete = function() {
        db.close();
      };
    };

  });
}