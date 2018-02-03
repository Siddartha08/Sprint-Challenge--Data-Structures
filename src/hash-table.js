/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { LimitedArray, getIndexBelowMax, LinkedList } = require('./hash-table-helpers');

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }

  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    oldStorage.each((bucket) => {
      if (!bucket) return;
      bucket.forEach((pair) => {
        this.insert(pair.head, pair.tail, pair.next);
      });
    });
  }

  capacityIsFull() {
    let fullCells = 0;
    this.storage.each((bucket) => {
      if (bucket !== undefined) fullCells++;
    });
    return fullCells / this.limit >= 0.75;
  }

  // Adds the given key, value pair to the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // If no bucket has been created for that index, instantiate a new bucket and add the key, value pair to that new bucket
  // If the key already exists in the bucket, the newer value should overwrite the older value associated with that key
  insert(key, value) {
    const newbucket = new LinkedList();
    const bucket = new LinkedList();
    if (this.capacityIsFull()) this.resize();
    const index = getIndexBelowMax(key.toString(), this.limit);
    if (this.storage.length === 0) {
      newbucket.head = index;
      newbucket.tail = value;
      newbucket.next = null;
    }
    if (this.storage.length === 0) {
      this.storage.set(index, newbucket);
    }
    if (this.storage.length > 0) {
      bucket.head = index;
      bucket.tail = value;
      bucket.next = null;
    }
    for (let i = 0; i < this.storage.length; i++) {
      if (this.storage[i].head === index) {
        this.storage[i].tail = value;

      }
    }
    if (newbucket.head === index) {
      this.storage.set(index, newbucket);
    }
    this.storage.set(index, bucket);
  }
  // Removes the key, value pair from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Remove the key, value pair from the bucket
  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    for (let i = 0; i < this.storage.length; i++) {
      let newLength = 0;
      if (this.storage[i].head === key) {
        this.storage.splice(this.storage[i], 1);
        newLength = this.storage;
        return newLength;
      }
      if (newLength >= 3) {
        this.storage[i - 1].next = this.storage[i + 1].tail;
      }
    }
  }
  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    let retrieved;
    if (bucket) {
      retrieved = this.storage[index].tail;
    }
    return retrieved;
  }
}

module.exports = HashTable;
