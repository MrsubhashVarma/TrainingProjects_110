// Base API URL config
const API_BASE_URL = 'http://127.0.0.1:8001';

// State management
let allBooks = [];
let isEditing = false;
let editingBookId = null;

// DOM Elements
const bookForm = document.getElementById('book-form');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const btnText = document.getElementById('btn-text');
const formTitleText = document.getElementById('form-title-text');
const formDescText = document.getElementById('form-desc-text');
const formPanel = document.querySelector('.form-panel');

const searchInput = document.getElementById('search-input');
const booksListBody = document.getElementById('books-list-body');
const totalCountEl = document.getElementById('total-count');
const refreshBtn = document.getElementById('refresh-btn');

const dbStatusBadge = document.getElementById('db-status-badge');
const dbStatusText = document.getElementById('db-status-text');
const statusDot = dbStatusBadge.querySelector('.status-dot');

// Input fields
const inputBookId = document.getElementById('book_id');
const inputTitle = document.getElementById('title');
const inputAuthor = document.getElementById('author');
const inputCategory = document.getElementById('category');
const inputPrice = document.getElementById('price');
const inputQuantity = document.getElementById('quantity');
const inputPublisher = document.getElementById('publisher');

// Init application on load
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    setupEventListeners();
});

// Setup interaction listeners
function setupEventListeners() {
    bookForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', exitEditMode);
    refreshBtn.addEventListener('click', fetchBooks);
    searchInput.addEventListener('input', handleSearch);
}

// -------------------------------------------------------------
// Toast Notification Utility
// -------------------------------------------------------------
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-exclamation';
    
    toast.innerHTML = `
        <i class="fa-solid ${iconClass} toast-icon"></i>
        <div class="toast-content">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Automatically fade out and remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// -------------------------------------------------------------
// Update Database Status Badge
// -------------------------------------------------------------
function updateConnectionStatus(modeHeader) {
    statusDot.className = 'status-dot pulse';
    
    if (modeHeader === 'MongoDB-Atlas') {
        statusDot.classList.add('online');
        dbStatusText.textContent = 'MongoDB Atlas';
        dbStatusBadge.style.borderColor = 'rgba(46, 213, 115, 0.3)';
    } else if (modeHeader === 'Mock-JSON') {
        statusDot.classList.add('fallback');
        dbStatusText.textContent = 'Local DB (Fallback)';
        dbStatusBadge.style.borderColor = 'rgba(255, 165, 2, 0.3)';
    } else {
        statusDot.className = 'status-dot'; // no pulse, no color
        dbStatusText.textContent = 'Offline';
        dbStatusBadge.style.borderColor = 'rgba(255, 71, 87, 0.3)';
    }
}

// -------------------------------------------------------------
// Read: Fetch and Render Books
// -------------------------------------------------------------
async function fetchBooks() {
    try {
        renderLoadingState();
        const response = await fetch(`${API_BASE_URL}/books/`);
        
        // Inspect custom header for database status
        const dbMode = response.headers.get('X-Database-Mode');
        updateConnectionStatus(dbMode);

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Failed to fetch catalog.');
        }

        allBooks = await response.json();
        
        // Sort books by book_id ascending
        allBooks.sort((a, b) => a.book_id - b.book_id);
        
        renderBooks(allBooks);
    } catch (err) {
        console.error(err);
        updateConnectionStatus(null);
        renderErrorState(err.message);
        showToast(err.message, 'error');
    }
}

function renderLoadingState() {
    booksListBody.innerHTML = `
        <tr class="placeholder-row">
            <td colspan="8">
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Loading books from database...</p>
                </div>
            </td>
        </tr>
    `;
}

function renderErrorState(message) {
    booksListBody.innerHTML = `
        <tr class="placeholder-row">
            <td colspan="8">
                <div class="empty-state">
                    <i class="fa-solid fa-triangle-exclamation empty-state-icon" style="color: var(--error)"></i>
                    <p>Error connecting to backend: ${message}</p>
                    <button class="btn btn-secondary" onclick="fetchBooks()">Try Again</button>
                </div>
            </td>
        </tr>
    `;
    totalCountEl.textContent = 'Connection failed';
}

function renderBooks(booksList) {
    if (booksList.length === 0) {
        booksListBody.innerHTML = `
            <tr class="placeholder-row">
                <td colspan="8">
                    <div class="empty-state">
                        <i class="fa-solid fa-box-open empty-state-icon"></i>
                        <p>No books found in the library directory.</p>
                    </div>
                </td>
            </tr>
        `;
        totalCountEl.textContent = 'Total: 0 books';
        return;
    }

    booksListBody.innerHTML = '';
    booksList.forEach(book => {
        const row = document.createElement('tr');
        row.id = `book-row-${book.book_id}`;
        
        // Check if currently editing this row
        if (isEditing && editingBookId === book.book_id) {
            row.className = 'row-editing';
        }

        const isLowStock = book.quantity <= 5;
        const formattedPrice = Number(book.price).toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0
        });

        row.innerHTML = `
            <td><strong>${book.book_id}</strong></td>
            <td class="book-title-cell">${escapeHtml(book.title)}</td>
            <td class="book-author-cell">${escapeHtml(book.author)}</td>
            <td><span class="category-tag">${escapeHtml(book.category)}</span></td>
            <td><span class="price-text">₹${formattedPrice}</span></td>
            <td><span class="quantity-badge ${isLowStock ? 'low' : ''}">${book.quantity}</span></td>
            <td>${escapeHtml(book.publisher)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn action-btn action-btn-edit" onclick="enterEditMode(${book.book_id})" title="Edit Details">
                        <i class="fa-solid fa-pen-to-square"></i> Update
                    </button>
                    <button class="btn action-btn action-btn-delete" onclick="handleDelete(${book.book_id})" title="Delete Book">
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                </div>
            </td>
        `;
        booksListBody.appendChild(row);
    });

    totalCountEl.textContent = `Total: ${booksList.length} book${booksList.length === 1 ? '' : 's'}`;
}

// Escapes raw values to prevent XSS injection
function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// -------------------------------------------------------------
// Live Client Search
// -------------------------------------------------------------
function handleSearch(e) {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
        renderBooks(allBooks);
        return;
    }

    const filtered = allBooks.filter(book => {
        return book.book_id.toString().includes(term) ||
               book.title.toLowerCase().includes(term) ||
               book.author.toLowerCase().includes(term) ||
               book.category.toLowerCase().includes(term) ||
               book.publisher.toLowerCase().includes(term);
    });

    renderBooks(filtered);
}

// -------------------------------------------------------------
// Validation & Form Submission (Create & Update)
// -------------------------------------------------------------
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showToast('Please correct validation errors first.', 'error');
        return;
    }

    const payload = {
        book_id: parseInt(inputBookId.value.trim()),
        title: inputTitle.value.trim(),
        author: inputAuthor.value.trim(),
        category: inputCategory.value.trim(),
        price: parseFloat(inputPrice.value.trim()),
        quantity: parseInt(inputQuantity.value.trim()),
        publisher: inputPublisher.value.trim()
    };

    try {
        let url = `${API_BASE_URL}/books/add/`;
        let method = 'POST';
        
        if (isEditing) {
            url = `${API_BASE_URL}/books/update/${editingBookId}/`;
            method = 'PUT';
        }

        submitBtn.disabled = true;
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const dbMode = response.headers.get('X-Database-Mode');
        updateConnectionStatus(dbMode);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Server operation failed.');
        }

        if (isEditing) {
            showToast(`Book ID ${editingBookId} updated successfully.`, 'success');
            exitEditMode();
        } else {
            showToast(`Book "${payload.title}" added to inventory!`, 'success');
            clearForm();
        }

        fetchBooks();
    } catch (err) {
        console.error(err);
        showToast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
    }
}

// Validation logic
function validateForm() {
    let isValid = true;
    
    // Helper to print error
    const setError = (fieldId, message) => {
        const errorEl = document.getElementById(`error-${fieldId}`);
        errorEl.textContent = message;
        if (message) {
            isValid = false;
            document.getElementById(fieldId).style.borderColor = 'var(--error)';
        } else {
            document.getElementById(fieldId).style.borderColor = 'var(--border-color)';
        }
    };

    // Reset error states
    ['book_id', 'title', 'author', 'category', 'price', 'quantity', 'publisher'].forEach(f => setError(f, ''));

    // Validate book_id (only check integer rules; uniqueness is checked on backend)
    const bidVal = inputBookId.value.trim();
    if (!bidVal) {
        setError('book_id', 'Book ID is required.');
    } else {
        const idInt = Number(bidVal);
        if (!Number.isInteger(idInt) || idInt <= 0) {
            setError('book_id', 'Book ID must be a positive integer.');
        }
    }

    // Validate Title
    if (!inputTitle.value.trim()) {
        setError('title', 'Book title is required.');
    }

    // Validate Author
    if (!inputAuthor.value.trim()) {
        setError('author', 'Author name is required.');
    }

    // Validate Category
    if (!inputCategory.value.trim()) {
        setError('category', 'Category is required.');
    }

    // Validate Price
    const priceVal = inputPrice.value.trim();
    if (!priceVal) {
        setError('price', 'Price is required.');
    } else {
        const pNum = Number(priceVal);
        if (isNaN(pNum) || pNum < 0) {
            setError('price', 'Price must be a positive number.');
        }
    }

    // Validate Quantity
    const qtyVal = inputQuantity.value.trim();
    if (!qtyVal) {
        setError('quantity', 'Quantity is required.');
    } else {
        const qInt = Number(qtyVal);
        if (!Number.isInteger(qInt) || qInt < 0) {
            setError('quantity', 'Quantity must be a positive integer.');
        }
    }

    // Validate Publisher
    if (!inputPublisher.value.trim()) {
        setError('publisher', 'Publisher name is required.');
    }

    return isValid;
}

function clearForm() {
    bookForm.reset();
    ['book_id', 'title', 'author', 'category', 'price', 'quantity', 'publisher'].forEach(f => {
        document.getElementById(`error-${f}`).textContent = '';
        document.getElementById(f).style.borderColor = 'var(--border-color)';
    });
}

// -------------------------------------------------------------
// Update: Enter/Exit Edit Mode
// -------------------------------------------------------------
function enterEditMode(bookId) {
    const book = allBooks.find(b => b.book_id === bookId);
    if (!book) return;

    isEditing = true;
    editingBookId = bookId;

    // Remove editing styles from any other rows
    document.querySelectorAll('.books-table tbody tr').forEach(r => r.classList.remove('row-editing'));
    
    // Add edit style to target row
    const targetRow = document.getElementById(`book-row-${bookId}`);
    if (targetRow) {
        targetRow.classList.add('row-editing');
    }

    // Populate form
    inputBookId.value = book.book_id;
    inputBookId.disabled = true; // Book ID cannot be modified on update
    
    inputTitle.value = book.title;
    inputAuthor.value = book.author;
    inputCategory.value = book.category;
    inputPrice.value = book.price;
    inputQuantity.value = book.quantity;
    inputPublisher.value = book.publisher;

    // Toggle card styles & UI labels
    formPanel.classList.add('edit-mode');
    formTitleText.innerHTML = '<i class="fa-solid fa-pen-to-square header-icon"></i> Edit Book Details';
    formDescText.textContent = `Modifying details for Book ID ${bookId}`;
    btnText.textContent = 'Save Changes';
    cancelBtn.classList.remove('hidden');

    // Scroll up to form on mobile viewports
    formPanel.scrollIntoView({ behavior: 'smooth' });
}

function exitEditMode() {
    isEditing = false;
    editingBookId = null;

    // Reset table styles
    document.querySelectorAll('.books-table tbody tr').forEach(r => r.classList.remove('row-editing'));

    // Enable ID field and clear fields
    inputBookId.disabled = false;
    clearForm();

    // Toggle card styling & UI labels
    formPanel.classList.remove('edit-mode');
    formTitleText.innerHTML = '<i class="fa-solid fa-plus-circle header-icon"></i> Add New Book';
    formDescText.textContent = 'Fill in the book details to expand the catalog';
    btnText.textContent = 'Add Book';
    cancelBtn.classList.add('hidden');
}

// -------------------------------------------------------------
// Delete: Remove a book record
// -------------------------------------------------------------
async function handleDelete(bookId) {
    const confirmMsg = `Are you sure you want to delete book ID ${bookId}? This action cannot be undone.`;
    if (!confirm(confirmMsg)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/books/delete/${bookId}/`, {
            method: 'DELETE'
        });

        const dbMode = response.headers.get('X-Database-Mode');
        updateConnectionStatus(dbMode);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Deletion failed.');
        }

        showToast(`Book ID ${bookId} has been successfully deleted.`, 'success');
        
        // If we are currently editing the deleted book, cancel edit mode
        if (isEditing && editingBookId === bookId) {
            exitEditMode();
        }

        fetchBooks();
    } catch (err) {
        console.error(err);
        showToast(err.message, 'error');
    }
}
