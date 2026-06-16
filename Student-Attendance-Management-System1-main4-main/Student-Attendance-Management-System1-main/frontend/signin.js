// Form submission handler
document.getElementById('signinForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Show loading state
    const submitButton = document.querySelector('.signin-button');
    submitButton.classList.add('loading');

    try {
        const response = await fetch('http://localhost:9005/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            let msg = 'Invalid username or password';
            try { const d = await response.json(); msg = d.message || msg; } catch (_) {}
            showAlert(msg, 'error');
            return;
        }

        const data = await response.json();

        // Only redirect if we have a valid token from the backend
        if (!data || !data.token) {
            showAlert('Login failed: No authentication token received.', 'error');
            return;
        }

        // Store token if remember me is checked
        if (remember) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', username);
        } else {
            sessionStorage.setItem('authToken', data.token);
            sessionStorage.setItem('username', username);
        }

        showAlert('Sign in successful! Redirecting...', 'success');

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        console.error('Sign in error:', error);
        // Backend is unreachable — do NOT redirect, show error
        showAlert('Backend server is unreachable. Please ensure the Spring Boot application is running on port 9005.', 'error');
    } finally {
        // Remove loading state
        submitButton.classList.remove('loading');
    }
});

// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const eyeIcon = this.querySelector('.eye-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
});

// Show alert function
function showAlert(message, type = 'error') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert ${type} show`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

// Input validation with real-time feedback
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('blur', function () {
        validateInput(this);
    });

    input.addEventListener('input', function () {
        if (this.classList.contains('invalid')) {
            validateInput(this);
        }
    });
});

function validateInput(input) {
    const value = input.value.trim();

    if (input.hasAttribute('required') && value === '') {
        input.classList.add('invalid');
        return false;
    }

    if (input.type === 'password' && value.length > 0 && value.length < 6) {
        input.classList.add('invalid');
        return false;
    }

    input.classList.remove('invalid');
    return true;
}

// Add invalid state styles dynamically
const style = document.createElement('style');
style.textContent = `
    .form-input.invalid {
        border-color: var(--error-color);
    }
    .form-input.invalid:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
`;
document.head.appendChild(style);

// Check if user is already logged in
window.addEventListener('load', function () {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (token) {
        // Verify token with backend
        verifyToken(token);
    }

    // Pre-fill username if remembered
    const rememberedUsername = localStorage.getItem('username');
    if (rememberedUsername) {
        document.getElementById('username').value = rememberedUsername;
        document.getElementById('remember').checked = true;
    }
});

async function verifyToken(token) {
    try {
        const response = await fetch('http://localhost:9005/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Token is valid, redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Token is invalid or expired, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('username');
        }
    } catch (error) {
        // Backend is unreachable — do NOT redirect, just clear the stale token
        console.error('Token verification error (backend may be offline):', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('username');
    }
}

// Handle Enter key in form
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('signinForm').dispatchEvent(new Event('submit'));
        }
    });
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
