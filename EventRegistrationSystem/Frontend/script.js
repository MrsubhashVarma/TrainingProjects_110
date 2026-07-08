/* -------------------------------------------------------------
   EVENT REGISTRATION MANAGEMENT SYSTEM - JAVASCRIPT
   Core Logic: Fetch API client, validations, and UI interactions
   ------------------------------------------------------------- */

// Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// State Management
let participantsList = [];
let isEditMode = false;
let editingId = null;
let deleteTargetId = null;

// DOM Elements
const form = document.getElementById('participant-form');
const inputId = document.getElementById('participant_id');
const inputName = document.getElementById('full_name');
const inputEmail = document.getElementById('email');
const inputPhone = document.getElementById('phone');
const inputCollege = document.getElementById('college');
const inputEvent = document.getElementById('event_name');
const inputFee = document.getElementById('registration_fee');

const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const cancelBtn = document.getElementById('cancel-btn');

const participantsContainer = document.getElementById('participants-list');
const totalCountSpan = document.getElementById('total-count');
const searchInput = document.getElementById('search-input');
const refreshBtn = document.getElementById('refresh-btn');

const dbStatusBadge = document.getElementById('db-status-badge');
const dbStatusText = document.getElementById('db-status-text');

// Confirmation Modal Elements
const deleteModal = document.getElementById('delete-modal');
const deleteParticipantNameSpan = document.getElementById('delete-participant-name');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    fetchParticipants();
    setupEventListeners();
});

// Setup Events
function setupEventListeners() {
    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Cancel edit button
    cancelBtn.addEventListener('click', exitEditMode);

    // Search input for real-time filter
    searchInput.addEventListener('input', () => {
        renderParticipants(searchInput.value.trim());
    });

    // Sync button
    refreshBtn.addEventListener('click', () => {
        showToast('Refreshing connection...', 'info');
        fetchParticipants();
    });

    // Delete Modal confirm/cancel
    confirmDeleteBtn.addEventListener('click', executeDelete);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    
    // Close modal if user clicks backdrop
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Add inline blur validations
    setupBlurValidations();
}

/* -------------------------------------------------------------
   API Calls using Fetch API
   ------------------------------------------------------------- */

// GET - Retrieve all participants
async function fetchParticipants() {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/participants/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        // Read custom header for database mode
        const dbMode = response.headers.get('X-Database-Mode');
        updateDatabaseStatus(dbMode, true);

        if (!response.ok) {
            throw new Error(`Failed to load participants. Status: ${response.status}`);
        }

        participantsList = await response.json();
        renderParticipants();
    } catch (error) {
        console.error('Error fetching participants:', error);
        updateDatabaseStatus(null, false);
        showToast('Unable to connect to backend server. Make sure Django is running.', 'error');
        renderParticipants(); // Render empty/cached state
    } finally {
        showLoading(false);
    }
}

// POST - Add a new participant
async function registerParticipant(payload) {
    try {
        const response = await fetch(`${API_BASE_URL}/participants/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            showToast(`Registered "${payload.full_name}" successfully!`, 'success');
            form.reset();
            clearValidationErrors();
            fetchParticipants();
        } else {
            showToast(data.error || 'Registration failed.', 'error');
        }
    } catch (error) {
        console.error('Error creating participant:', error);
        showToast('Network error during registration.', 'error');
    }
}

// PUT - Update existing participant
async function updateParticipant(id, payload) {
    try {
        const response = await fetch(`${API_BASE_URL}/participants/update/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            showToast(`Updated registration for "${payload.full_name}"!`, 'success');
            exitEditMode();
            fetchParticipants();
        } else {
            showToast(data.error || 'Update failed.', 'error');
        }
    } catch (error) {
        console.error('Error updating participant:', error);
        showToast('Network error during update.', 'error');
    }
}

// DELETE - Delete a participant
async function executeDelete() {
    if (!deleteTargetId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/participants/delete/${deleteTargetId}/`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'Participant removed.', 'success');
            closeDeleteModal();
            // If deleting the record currently being edited, reset the edit state
            if (isEditMode && editingId === deleteTargetId) {
                exitEditMode();
            }
            fetchParticipants();
        } else {
            showToast(data.error || 'Deletion failed.', 'error');
        }
    } catch (error) {
        console.error('Error deleting participant:', error);
        showToast('Network error during deletion.', 'error');
    }
}

/* -------------------------------------------------------------
   Form Handling & Validations
   ------------------------------------------------------------- */

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Perform full form validation
    const isValid = validateForm();
    if (!isValid) {
        showToast('Please fix the errors in the form.', 'error');
        return;
    }

    const payload = {
        participant_id: parseInt(inputId.value),
        full_name: inputName.value.trim(),
        email: inputEmail.value.trim(),
        phone: inputPhone.value.trim(),
        college: inputCollege.value.trim(),
        event_name: inputEvent.value.trim(),
        registration_fee: parseFloat(inputFee.value)
    };

    if (isEditMode) {
        updateParticipant(editingId, payload);
    } else {
        registerParticipant(payload);
    }
}

// Client Side Form Validation Checks
function validateForm() {
    let isValid = true;

    // Participant ID validation
    const idVal = inputId.value.trim();
    if (!idVal) {
        setError('participant_id', 'Participant ID is required.');
        isValid = false;
    } else {
        const numId = Number(idVal);
        if (!Number.isInteger(numId) || numId <= 0) {
            setError('participant_id', 'ID must be a positive integer.');
            isValid = false;
        } else if (!isEditMode) {
            // Check uniqueness locally before submitting (Add mode)
            const exists = participantsList.some(p => p.participant_id === numId);
            if (exists) {
                setError('participant_id', `Participant ID ${idVal} is already in use.`);
                isValid = false;
            } else {
                clearError('participant_id');
            }
        } else {
            clearError('participant_id');
        }
    }

    // Name validation
    if (!inputName.value.trim()) {
        setError('full_name', 'Full Name is required.');
        isValid = false;
    } else if (inputName.value.trim().length < 2) {
        setError('full_name', 'Name must be at least 2 characters.');
        isValid = false;
    } else {
        clearError('full_name');
    }

    // Email validation
    const emailVal = inputEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
        setError('email', 'Email is required.');
        isValid = false;
    } else if (!emailRegex.test(emailVal)) {
        setError('email', 'Provide a valid email address.');
        isValid = false;
    } else {
        clearError('email');
    }

    // Phone validation (simple format check)
    const phoneVal = inputPhone.value.trim();
    const phoneRegex = /^[0-9-+()\s]{10,15}$/;
    if (!phoneVal) {
        setError('phone', 'Phone number is required.');
        isValid = false;
    } else if (!phoneRegex.test(phoneVal)) {
        setError('phone', 'Provide a valid 10-15 digit phone number.');
        isValid = false;
    } else {
        clearError('phone');
    }

    // College validation
    if (!inputCollege.value.trim()) {
        setError('college', 'College name is required.');
        isValid = false;
    } else {
        clearError('college');
    }

    // Event validation
    if (!inputEvent.value.trim()) {
        setError('event_name', 'Event name is required.');
        isValid = false;
    } else {
        clearError('event_name');
    }

    // Registration fee validation
    const feeVal = inputFee.value.trim();
    if (!feeVal) {
        setError('registration_fee', 'Registration fee is required.');
        isValid = false;
    } else {
        const numFee = Number(feeVal);
        if (isNaN(numFee) || numFee < 0) {
            setError('registration_fee', 'Fee must be zero or a positive number.');
            isValid = false;
        } else {
            clearError('registration_fee');
        }
    }

    return isValid;
}

function setupBlurValidations() {
    const fields = [
        { id: 'participant_id', validate: () => validateField('participant_id') },
        { id: 'full_name', validate: () => validateField('full_name') },
        { id: 'email', validate: () => validateField('email') },
        { id: 'phone', validate: () => validateField('phone') },
        { id: 'college', validate: () => validateField('college') },
        { id: 'event_name', validate: () => validateField('event_name') },
        { id: 'registration_fee', validate: () => validateField('registration_fee') }
    ];

    fields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
            el.addEventListener('blur', field.validate);
            el.addEventListener('input', () => {
                // Remove error style instantly as user types
                clearError(field.id);
            });
        }
    });
}

function validateField(fieldId) {
    // Just trigger the validation function which displays single errors
    validateForm();
}

function setError(id, message) {
    const errorEl = document.getElementById(`error-${id}`);
    const inputEl = document.getElementById(id);
    if (errorEl) {
        errorEl.textContent = message;
    }
    if (inputEl) {
        inputEl.classList.add('input-error');
    }
}

function clearError(id) {
    const errorEl = document.getElementById(`error-${id}`);
    const inputEl = document.getElementById(id);
    if (errorEl) {
        errorEl.textContent = '';
    }
    if (inputEl) {
        inputEl.classList.remove('input-error');
    }
}

function clearValidationErrors() {
    const fields = ['participant_id', 'full_name', 'email', 'phone', 'college', 'event_name', 'registration_fee'];
    fields.forEach(clearError);
}

/* -------------------------------------------------------------
   Edit / State Transitions
   ------------------------------------------------------------- */

function enterEditMode(participant) {
    isEditMode = true;
    editingId = participant.participant_id;

    // Fill form fields
    inputId.value = participant.participant_id;
    inputName.value = participant.full_name;
    inputEmail.value = participant.email;
    inputPhone.value = participant.phone;
    inputCollege.value = participant.college;
    inputEvent.value = participant.event_name;
    inputFee.value = participant.registration_fee;

    // Configure UI elements
    inputId.disabled = true;
    btnText.textContent = 'Update Details';
    submitBtn.classList.remove('btn-primary');
    submitBtn.classList.add('btn-primary'); // keep styling primary, maybe change icon
    const icon = submitBtn.querySelector('i');
    if (icon) {
        icon.className = 'fa-solid fa-square-check';
    }
    cancelBtn.classList.remove('hidden');

    // Change title text
    document.getElementById('form-title-text').innerHTML = '<i class="fa-solid fa-user-gear header-icon"></i> Update Participant';
    document.getElementById('form-desc-text').textContent = `Editing registration info for ID: ${participant.participant_id}`;

    // Clear any pending validation error outlines
    clearValidationErrors();

    // Scroll form into view for small screen sizes
    form.scrollIntoView({ behavior: 'smooth' });
}

function exitEditMode() {
    isEditMode = false;
    editingId = null;

    // Reset Form
    form.reset();
    inputId.disabled = false;
    btnText.textContent = 'Register Participant';
    const icon = submitBtn.querySelector('i');
    if (icon) {
        icon.className = 'fa-solid fa-arrow-right';
    }
    cancelBtn.classList.add('hidden');

    // Restore title texts
    document.getElementById('form-title-text').innerHTML = '<i class="fa-solid fa-user-plus header-icon"></i> Register Participant';
    document.getElementById('form-desc-text').textContent = 'Add details to register a participant for an event';

    clearValidationErrors();
}

/* -------------------------------------------------------------
   Rendering & DOM manipulation
   ------------------------------------------------------------- */

function renderParticipants(filterQuery = '') {
    // Clear list
    participantsContainer.innerHTML = '';
    
    let filteredList = participantsList;
    if (filterQuery) {
        const query = filterQuery.toLowerCase();
        filteredList = participantsList.filter(p => 
            p.participant_id.toString().includes(query) ||
            p.full_name.toLowerCase().includes(query) ||
            p.email.toLowerCase().includes(query) ||
            p.phone.includes(query) ||
            p.college.toLowerCase().includes(query) ||
            p.event_name.toLowerCase().includes(query)
        );
    }

    // Update count
    totalCountSpan.textContent = `Total: ${filteredList.length} participant${filteredList.length === 1 ? '' : 's'}`;

    if (filteredList.length === 0) {
        participantsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-users-slash"></i>
                <p>${participantsList.length === 0 ? 'No participants registered yet.' : 'No matching participants found.'}</p>
            </div>
        `;
        return;
    }

    // Loop and build cards
    filteredList.forEach(participant => {
        const card = document.createElement('div');
        card.className = 'participant-card';
        card.setAttribute('data-id', participant.participant_id);

        card.innerHTML = `
            <div class="participant-info">
                <div class="p-primary-row">
                    <span class="p-id">${participant.participant_id}</span>
                    <span class="p-name">${escapeHTML(participant.full_name)}</span>
                    <span class="p-event-badge">${escapeHTML(participant.event_name)}</span>
                    <span class="p-fee">₹${participant.registration_fee}</span>
                </div>
                <div class="p-secondary-row">
                    <span class="p-detail-item" title="College">
                        <i class="fa-solid fa-building-columns"></i>
                        <span>${escapeHTML(participant.college)}</span>
                    </span>
                    <span class="p-detail-item" title="Email">
                        <i class="fa-solid fa-envelope"></i>
                        <span>${escapeHTML(participant.email)}</span>
                    </span>
                    <span class="p-detail-item" title="Phone">
                        <i class="fa-solid fa-phone"></i>
                        <span>${escapeHTML(participant.phone)}</span>
                    </span>
                </div>
            </div>
            <div class="card-actions">
                <button type="button" class="btn btn-secondary btn-icon-only edit-btn" title="Update Details">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="btn btn-danger btn-icon-only delete-btn" title="Delete Registration">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        // Action event handlers
        card.querySelector('.edit-btn').addEventListener('click', () => {
            enterEditMode(participant);
        });

        card.querySelector('.delete-btn').addEventListener('click', () => {
            openDeleteModal(participant);
        });

        participantsContainer.appendChild(card);
    });
}

function showLoading(show) {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        if (show) {
            loader.classList.remove('hidden');
        } else {
            loader.classList.add('hidden');
        }
    }
}

// Update database connection indicator
function updateDatabaseStatus(dbMode, connected) {
    dbStatusBadge.className = 'status-badge';
    
    if (!connected) {
        dbStatusBadge.classList.add('mock-mode');
        dbStatusText.textContent = 'Server Offline';
        return;
    }

    if (dbMode === 'MongoDB-Atlas') {
        dbStatusBadge.classList.add('atlas-mode');
        dbStatusText.textContent = 'MongoDB Atlas';
    } else {
        dbStatusBadge.classList.add('mock-mode');
        dbStatusText.textContent = 'Local DB (Fallback)';
    }
}

/* -------------------------------------------------------------
   Delete Dialog Modals & Toasts
   ------------------------------------------------------------- */

function openDeleteModal(participant) {
    deleteTargetId = participant.participant_id;
    deleteParticipantNameSpan.textContent = `${participant.full_name} (ID: ${participant.participant_id})`;
    deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
    deleteTargetId = null;
    deleteModal.classList.add('hidden');
}

// Toast Alert Manager
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `
        <i class="${iconClass}"></i>
        <div class="toast-message">${escapeHTML(message)}</div>
        <i class="fa-solid fa-xmark toast-close"></i>
    `;

    // Toast Close click
    toast.querySelector('.toast-close').addEventListener('click', () => {
        dismissToast(toast);
    });

    container.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            dismissToast(toast);
        }
    }, 4000);
}

function dismissToast(toast) {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Escape helper to prevent cross-site scripting
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
