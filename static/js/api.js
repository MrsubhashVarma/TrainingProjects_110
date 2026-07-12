/**
 * Vitalis Pharmacy - Core API Client
 */

const VitalisAPI = {
    // Base URL configuration
    baseUrl: '/api',

    // Helper: Get Auth Headers
    getHeaders(isFormData = false) {
        const headers = {};
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        const token = localStorage.getItem('vitalis_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    // Core Fetch Wrapper
    async request(endpoint, method = 'GET', data = null, isFormData = false) {
        try {
            const options = {
                method,
                headers: this.getHeaders(isFormData)
            };

            if (data) {
                options.body = isFormData ? data : JSON.stringify(data);
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
            const result = await response.json();

            // Handle unauthorized globally
            if (response.status === 401) {
                this.logout(false);
                if (window.location.pathname !== '/login/' && window.location.pathname !== '/register/') {
                    window.location.href = '/login/';
                }
            }

            return { ok: response.ok, status: response.status, data: result };
        } catch (error) {
            console.error('API Error:', error);
            return { ok: false, status: 500, data: { success: false, message: 'Network error occurred.' } };
        }
    },

    // Toast Notification System
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'info';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'warning-circle';

        toast.innerHTML = `<i class="ph ph-${icon} ph-lg"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Auth state management
    setAuth(token, user) {
        localStorage.setItem('vitalis_token', token);
        localStorage.setItem('vitalis_user', JSON.stringify(user));
        this.updateNavigation();
    },

    logout(redirect = true) {
        // Optimistic clear
        localStorage.removeItem('vitalis_token');
        localStorage.removeItem('vitalis_user');
        
        // Notify server silently
        this.request('/logout', 'POST').catch(() => {});
        
        this.updateNavigation();
        if (redirect) {
            window.location.href = '/login/';
        }
    },

    getUser() {
        const userStr = localStorage.getItem('vitalis_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },

    // UI Updates
    updateNavigation() {
        const authSection = document.getElementById('nav-auth-section');
        if (!authSection) return;

        const user = this.getUser();
        
        if (user) {
            let links = '';
            if (user.role === 'admin') {
                links += `<a href="/admin-dashboard/" class="nav-link"><i class="ph ph-shield-check"></i> Dashboard</a>`;
            } else {
                links += `
                    <a href="/cart/" class="nav-link"><i class="ph ph-shopping-cart"></i> Cart</a>
                    <a href="/orders/" class="nav-link"><i class="ph ph-receipt"></i> Orders</a>
                `;
            }
            
            links += `
                <a href="/profile/" class="nav-link"><i class="ph ph-user"></i> ${user.name.split(' ')[0]}</a>
                <button onclick="VitalisAPI.logout()" class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Logout</button>
            `;
            authSection.innerHTML = links;
        } else {
            authSection.innerHTML = `
                <a href="/login/" class="nav-link">Log In</a>
                <a href="/register/" class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.9rem;">Sign Up</a>
            `;
        }
    }
};
