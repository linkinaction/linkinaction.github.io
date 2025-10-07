// Contact form functionality
export function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-form-message');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        contactMessage.textContent = 'Sending…';
        contactMessage.className = 'mt-4 text-center text-gray-600';

        try {
            const formData = new FormData(contactForm);
            
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                contactForm.reset();
                contactMessage.textContent = 'Thank you! Your message has been sent.';
                contactMessage.className = 'mt-4 text-center text-green-600';
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Contact form error:', error);
            contactMessage.textContent = 'Oops—something went wrong. Please try again.';
            contactMessage.className = 'mt-4 text-center text-red-600';
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Form validation
export function setupFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('border-red-500');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mt-1 text-sm text-red-600';
    errorDiv.textContent = message;
    errorDiv.id = `${field.id}-error`;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500');
    const existingError = document.getElementById(`${field.id}-error`);
    if (existingError) {
        existingError.remove();
    }
}