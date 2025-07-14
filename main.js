const STORAGE_KEY = 'BOOKSHELF_APPS';
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
let books = [];

function isStorageExist() {
  return typeof Storage !== 'undefined';
}

// Generate unique ID
function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

// Save books to localStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  document.dispatchEvent(new Event(SAVED_EVENT));
}

// Load books from localStorage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) books = JSON.parse(serializedData);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Create book element
function makeBookElement(book) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = book.title;
  bookTitle.setAttribute('data-testid', 'bookItemTitle');

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Penulis: ${book.author}`;
  bookAuthor.setAttribute('data-testid', 'bookItemAuthor');

  const bookYear = document.createElement('p');
  bookYear.innerText = `Tahun: ${book.year}`;
  bookYear.setAttribute('data-testid', 'bookItemYear');

  const actionContainer = document.createElement('div');

  const toggleButton = document.createElement('button');
  toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.addEventListener('click', () => toggleBookStatus(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit Buku';
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.addEventListener('click', () => editBook(book.id));

  actionContainer.append(toggleButton, deleteButton, editButton);

  const container = document.createElement('div');
  container.classList.add('book_item');
  container.setAttribute('data-bookid', book.id);
  container.setAttribute('data-testid', 'bookItem');
  container.append(bookTitle, bookAuthor, bookYear, actionContainer);

  return container;
}

// Render books
function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}

function addBook(event) {
  event.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const id = generateId();
  const book = generateBookObject(id, title, author, year, isComplete);
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  event.target.reset();
}

function toggleBookStatus(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function deleteBook(bookId) {
  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    const title = prompt('Edit Judul:', book.title);
    const author = prompt('Edit Penulis:', book.author);
    const year = parseInt(prompt('Edit Tahun:', book.year));
    if (title && author && year) {
      book.title = title;
      book.author = author;
      book.year = year;
      saveData();
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  }
}

function searchBook(event) {
  event.preventDefault();
  const keyword = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(keyword));

  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of filteredBooks) {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}

// Year input
function populateYearDatalist() {
  const currentYear = new Date().getFullYear();
  const startYear = 1950;
  const datalist = document.getElementById('yearOptions');

  for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement('option');
    option.value = year;
    datalist.appendChild(option);
  }
}

function refreshSearch() {
  document.getElementById('searchBookTitle').value = '';
  document.dispatchEvent(new Event(RENDER_EVENT));
}

window.addEventListener('load', () => {
  if (isStorageExist()) loadDataFromStorage();

  populateYearDatalist();
  document.getElementById('bookForm').addEventListener('submit', addBook);
  document.getElementById('searchBook').addEventListener('submit', searchBook);
  document.getElementById('refreshSearch').addEventListener('click', refreshSearch);
  document.getElementById('bookForm').addEventListener('submit', addBook);
  document.getElementById('searchBook').addEventListener('submit', searchBook);
});

document.addEventListener(RENDER_EVENT, renderBooks);
