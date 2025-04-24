document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://127.0.0.1:8000';
    const registerForm = document.getElementById('registerForm');
    const captchaImage = document.getElementById('captchaImage');
    const captchaKeyInput = document.getElementById('captchaKey');
    const refreshBtn = document.getElementById('refreshCaptcha');
    const errorContainer = document.getElementById('errorContainer');
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    let originalBtnText = submitBtn.textContent;

    // Clear all error messages
    function clearErrors() {
        errorContainer.innerHTML = '';
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback').forEach(el => {
            el.remove();
        });
    }

    // Show error message in container
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger mb-2';
        errorElement.textContent = message;
        errorContainer.appendChild(errorElement);
    }

    // Show field-specific errors
    function showFieldError(field, messages) {
        const input = document.querySelector(`[name="${field}"]`);
        if (!input) return;

        input.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        
        // Handle both array of messages and single message
        if (Array.isArray(messages)) {
            errorDiv.textContent = messages.join(' ');
        } else {
            errorDiv.textContent = messages;
        }
        
        input.parentNode.appendChild(errorDiv);
    }

    // Update button state
    function setButtonState(loading) {
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading 
            ? '<span class="spinner-border spinner-border-sm" role="status"></span> Jo\'natilmoqda...' 
            : originalBtnText;
    }

    // Load CAPTCHA image
    async function loadCaptcha() {
        try {
            captchaImage.src = '';
            captchaImage.alt = 'Yuklanmoqda...';
            refreshBtn.disabled = true;

            const response = await fetch(`${API_BASE_URL}/api/captcha/`);
            if (!response.ok) throw new Error(`Serverdan ${response.status} kodli javob qaytdi`);

            const data = await response.json();
            captchaImage.src = data.captcha_image;
            captchaImage.alt = 'CAPTCHA tasviri';
            captchaKeyInput.value = data.captcha_key;
        } catch (error) {
            console.error('CAPTCHA yuklashda xato:', error);
            captchaImage.alt = 'CAPTCHA yuklanmadi';
            showError(`CAPTCHA yuklashda xato: ${error.message}`);
        } finally {
            refreshBtn.disabled = false;
        }
    }

    // Refresh CAPTCHA
    refreshBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loadCaptcha();
    });

    // Handle form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();
        setButtonState(true);

        const formData = {
            username: this.username.value.trim(),
            email: this.email.value.trim(),
            password: this.password.value,
            captcha: {
                key: this.captcha_key.value,
                value: this.captcha_value.value.trim()
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle Django REST framework validation errors
                if (result.errors) {
                    // Special case for non-field errors
                    if (result.errors.non_field_errors) {
                        showError(result.errors.non_field_errors.join(' '));
                    }
                    
                    // Handle field-specific errors
                    Object.entries(result.errors).forEach(([field, messages]) => {
                        if (field !== 'non_field_errors') {
                            showFieldError(field, messages);
                        }
                    });
                } 
                // Handle custom error messages
                else if (result.message) {
                    showError(result.message);
                }
                // Handle serializer validation errors (different format)
                else if (result.detail) {
                    showError(result.detail);
                }
                // Handle other error formats
                else {
                    let errorMessage = "Noto'g'ri so'rov yuborildi";
                    
                    // Try to extract error from response
                    if (typeof result === 'object') {
                        const firstError = Object.values(result)[0];
                        if (Array.isArray(firstError)) {
                            errorMessage = firstError.join(' ');
                        } else if (typeof firstError === 'string') {
                            errorMessage = firstError;
                        }
                    }
                    
                    showError(errorMessage);
                }
                
                await loadCaptcha();
                return;
            }

            // Success case - redirect to login page
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Xato:', error);
            showError('Serverga ulanib bo\'lmadi. Iltimos, internet aloqangizni tekshiring');
            await loadCaptcha();
        } finally {
            setButtonState(false);
        }
    });

    // Initial CAPTCHA load
    loadCaptcha();
});