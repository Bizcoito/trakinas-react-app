import * as firebase from 'firebase';

const getEnvConfig = () => {
  let config = {
    apiKey: 'AIzaSyAItuCrizWjUjITrls8bcMv8tJm_4iSYgM',
    authDomain: 'trakinas-dev.firebaseio.com',
    databaseURL: 'https://trakinas-dev.firebaseio.com/',
    projectId: 'trakinas-dev',
    storageBucket: 'trakinas-dev.appspot.com',
    messagingSenderId: '933462607227'
  }

  if (process.env.PRODUCTION) {
    config = {
      apiKey: 'AIzaSyB2EahiG5p4IF3aYbg6hpQN2PNWMaAKXgs',
      authDomain: 'bizcoitera.firebaseapp.com',
      databaseURL: 'https://bizcoitera.firebaseio.com',
      projectId: 'bizcoitera',
      storageBucket: 'bizcoitera.appspot.com',
      messagingSenderId: '976257491287'
    }
  }

  return config;
};

class FirebaseManager {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(getEnvConfig());
    }
  }

  static init() {
    firebase.initializeApp(getEnvConfig());
  }

  static updateBookAttribute(book, field, value) {
    const updates = {};
    const bookData = book;

    bookData[field] = value;
    updates['/books/' + book.bookId] = bookData;
    firebase.database().ref().update(updates);

    return FirebaseManager.getBookData(bookData.bookId).then(response => response);
  }

  static getBooks() {
    return firebase.database().ref('/books')
      .orderByChild('name')
      .once('value')
      .then(response => response);
  }

  static getBookData(bookId) {
    return firebase.database()
      .ref('/books/' + bookId)
      .once('value')
      .then(response => response.val());
  }

  getBook(bookId) {
    return firebase.database()
      .ref('/books/' + bookId)
      .once('value')
      .then(response => response.val());
  }

  createBook(bookData) {
    const newBookKey = firebase.database().ref().child('books').push().key;
    const bookId = { bookId: newBookKey };
    const firebaseBookData = { ...bookId, ...bookData };
    const updates = {};

    updates['/books/' + newBookKey] = firebaseBookData;

    firebase.database().ref().update(updates);
  }

  getBooks() {
    return firebase.database().ref('/books')
      .orderByChild('name')
      .once('value')
      .then(response => response);
  }

  searchBook(searchTerm) {
    const booksPromise = this.getBooks();
    const books = [];
    let searchResults = [];
    let searchTermRegexp;

    return booksPromise.then((firebaseResponse) => {
      firebaseResponse.forEach(child => { books.push(child.val()); });

      searchResults = books.filter((book) => {
        searchTermRegexp = new RegExp(searchTerm, 'i');
        return book.name.match(searchTermRegexp) || book.description.match(searchTermRegexp);
      });

      return searchResults;
    });
  }
}

export default FirebaseManager;
