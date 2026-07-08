const API_BASE_URL = 'http://127.0.0.1:8000/tasks/';

// App State
let tasksState = [];
let activeFilter = 'all';
let searchQuery = '';

// DOM Elements
const tasksContainer = document.getElementById('tasks-container');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const addTaskForm = document.getElementById('add-task-form');
const updateTaskForm = document.getElementById('update-task-form');
const updateModal = document.getElementById('update-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const filterTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('search-input');
const toastContainer = document.getElementById('toast-container');

// Stat Elements
const statTotalCount = document.getElementById('stat-total-count');
const statPendingCount = document.getElementById('stat-pending-count');
const statCompletedCount = document.getElementById('stat-completed-count');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Add Task
    addTaskForm.addEventListener('submit', handleAddTask);
    
    // Update Task Submit
    updateTaskForm.addEventListener('submit', handleUpdateTask);
    
    // Close Modal Events
    closeModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === updateModal) closeModal();
    });
    
    // Filter Tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.getAttribute('data-filter');
            applyFiltersAndSearch();
        });
    });
    
    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFiltersAndSearch();
    });
}

// Fetch all tasks from backend
async function fetchTasks() {
    showLoading(true);
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        tasksState = await response.json();
        
        const dbMode = response.headers.get('X-Database-Mode');
        updateDbBadge(dbMode);
        
        updateStats();
        applyFiltersAndSearch();
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        showToast('Unable to connect to the backend server. Please verify Django is running.', 'error');
        showLoading(false);
        tasksContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
    }
}

// Add a Task
async function handleAddTask(e) {
    e.preventDefault();
    
    const titleInput = document.getElementById('task-title');
    const descInput = document.getElementById('task-desc');
    const priorityInput = document.getElementById('task-priority');
    const statusInput = document.getElementById('task-status');
    
    const newTask = {
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        priority: priorityInput.value,
        status: statusInput.value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Failed to add task');
        }
        
        const addedTask = await response.json();
        tasksState.unshift(addedTask); // Add to beginning
        
        // Reset form
        titleInput.value = '';
        descInput.value = '';
        priorityInput.value = 'Medium';
        statusInput.value = 'Pending';
        
        updateStats();
        applyFiltersAndSearch();
        showToast('Task added successfully!', 'success');
    } catch (error) {
        console.error('Error adding task:', error);
        showToast(`Failed to add task: ${error.message}`, 'error');
    }
}

// Open Update Modal and populate form
function openUpdateModal(task) {
    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-desc').value = task.description;
    document.getElementById('edit-task-priority').value = task.priority;
    document.getElementById('edit-task-status').value = task.status;
    
    updateModal.classList.add('active');
}

function closeModal() {
    updateModal.classList.remove('active');
}

// Update a Task
async function handleUpdateTask(e) {
    e.preventDefault();
    
    const id = document.getElementById('edit-task-id').value;
    const updatedFields = {
        title: document.getElementById('edit-task-title').value.trim(),
        description: document.getElementById('edit-task-desc').value.trim(),
        priority: document.getElementById('edit-task-priority').value,
        status: document.getElementById('edit-task-status').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}update/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFields)
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Failed to update task');
        }
        
        const updatedTask = await response.json();
        
        // Update local state
        const index = tasksState.findIndex(t => t.id === id);
        if (index !== -1) {
            tasksState[index] = updatedTask;
        }
        
        closeModal();
        updateStats();
        applyFiltersAndSearch();
        showToast('Task updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating task:', error);
        showToast(`Failed to update task: ${error.message}`, 'error');
    }
}

// Quick Status Toggle
async function toggleTaskStatus(id, currentStatus) {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
        const response = await fetch(`${API_BASE_URL}update/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to toggle status');
        }
        
        const updatedTask = await response.json();
        
        // Update local state
        const index = tasksState.findIndex(t => t.id === id);
        if (index !== -1) {
            tasksState[index] = updatedTask;
        }
        
        updateStats();
        applyFiltersAndSearch();
        showToast(newStatus === 'Completed' ? 'Task completed! 🎉' : 'Task marked as pending.', 'success');
    } catch (error) {
        console.error('Error toggling status:', error);
        showToast('Failed to change status.', 'error');
    }
}

// Delete a Task
async function handleDeleteTask(id, cardElement) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}delete/${id}/`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        
        // Visual fade out first
        cardElement.classList.add('task-fade-out');
        setTimeout(() => {
            tasksState = tasksState.filter(t => t.id !== id);
            updateStats();
            applyFiltersAndSearch();
            showToast('Task deleted successfully.', 'success');
        }, 300);
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Failed to delete task.', 'error');
    }
}

// Filter and Search logic
function applyFiltersAndSearch() {
    let filtered = [...tasksState];
    
    // Apply Tab Filter
    if (activeFilter !== 'all') {
        filtered = filtered.filter(task => task.status === activeFilter);
    }
    
    // Apply Search
    if (searchQuery) {
        filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(searchQuery) || 
            task.description.toLowerCase().includes(searchQuery)
        );
    }
    
    renderTasks(filtered);
}

// Render list of tasks to the DOM
function renderTasks(tasks) {
    showLoading(false);
    
    // Clear container except spinner/empty state
    const elementsToRemove = tasksContainer.querySelectorAll('.task-card');
    elementsToRemove.forEach(el => el.remove());
    
    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    tasks.forEach(task => {
        const isCompleted = task.status === 'Completed';
        
        const card = document.createElement('div');
        card.className = `task-card glass-panel priority-${task.priority} status-${task.status}`;
        card.dataset.id = task.id;
        
        card.innerHTML = `
            <div class="task-card-header">
                <h3 class="task-title-text">${escapeHTML(task.title)}</h3>
                <span class="badge badge-priority-${task.priority}">${task.priority}</span>
            </div>
            
            <p class="task-desc-text">${escapeHTML(task.description)}</p>
            
            <div class="task-card-footer">
                <div class="status-indicator">
                    <span class="status-dot ${task.status.toLowerCase()}"></span>
                    <span>${task.status}</span>
                </div>
                
                <div class="task-actions">
                    <button class="action-btn complete-toggle-btn" title="${isCompleted ? 'Mark as Pending' : 'Mark as Completed'}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </button>
                    
                    <button class="action-btn edit-btn" title="Edit Task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    </button>
                    
                    <button class="action-btn delete-btn" title="Delete Task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                </div>
            </div>
        `;
        
        // Attach Event Listeners to actions
        card.querySelector('.complete-toggle-btn').addEventListener('click', () => toggleTaskStatus(task.id, task.status));
        card.querySelector('.edit-btn').addEventListener('click', () => openUpdateModal(task));
        card.querySelector('.delete-btn').addEventListener('click', () => handleDeleteTask(task.id, card));
        
        tasksContainer.appendChild(card);
    });
}

// Helpers
function showLoading(show) {
    if (show) {
        loadingState.classList.remove('hidden');
        emptyState.classList.add('hidden');
    } else {
        loadingState.classList.add('hidden');
    }
}

function updateStats() {
    const total = tasksState.length;
    const pending = tasksState.filter(t => t.status === 'Pending').length;
    const completed = tasksState.filter(t => t.status === 'Completed').length;
    
    statTotalCount.textContent = total;
    statPendingCount.textContent = pending;
    statCompletedCount.textContent = completed;
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    if (type === 'success') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'error') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    // Auto remove toast
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function updateDbBadge(mode) {
    const badge = document.getElementById('db-status-badge');
    if (!badge) return;
    if (mode === 'Mock-JSON') {
        badge.className = 'db-status-badge mode-mock';
        badge.querySelector('.status-text').textContent = 'Offline (Local JSON)';
        badge.title = 'Configure MongoDB Atlas credentials in Backend/.env to connect to the cloud.';
    } else {
        badge.className = 'db-status-badge mode-atlas';
        badge.querySelector('.status-text').textContent = 'MongoDB Connected';
        badge.title = 'Successfully connected to MongoDB Atlas Cluster!';
    }
}
