document.addEventListener("DOMContentLoaded", function() {
    function updatePasswordStrength() {
        var password = document.getElementById('user_password').value;
        var strengthMeter = document.getElementById('password-strength-meter');
        var strengthText = document.getElementById('password-strength-text');

        if (password === "") {
            // Hide the meter and text when the password field is empty
            strengthMeter.style.display = 'none';
            strengthText.style.display = 'none';
            return;
        } else {
            // Show the meter and text when there is input
            strengthMeter.style.display = 'block';
            strengthText.style.display = 'block';
        }

        var strength = 0;
        if (password.length > 5) strength++;
        if (password.length > 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        strengthMeter.value = strength;

        var strengthMessage = '';
        switch (strength) {
            case 0:
            case 1:
                strengthMessage = 'Very Weak';
                break;
            case 2:
                strengthMessage = 'Weak';
                break;
            case 3:
                strengthMessage = 'Medium';
                break;
            case 4:
                strengthMessage = 'Strong';
                break;
            case 5:
                strengthMessage = 'Very Strong';
                break;
        }

        strengthText.textContent = strengthMessage;
    }

    function togglePasswordVisibility() {
        var passwordField = document.getElementById('user_password');
        var showPasswordCheckbox = document.getElementById('show-password');
        if (showPasswordCheckbox.checked) {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    }

    // Attach functions to the global scope if needed
    window.updatePasswordStrength = updatePasswordStrength;
    window.togglePasswordVisibility = togglePasswordVisibility;

        
    document.getElementById('user-signup-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission
    
        const formData = new FormData(event.target);
        const data = {
            username: formData.get('username'),
            user_email: formData.get('user_email'),
            user_phonenumber: formData.get('user_phonenumber'),
            user_password: formData.get('user_password')
        };
    
        try {
            const response = await fetch('/users/account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                // User account created successfully
                showToast("Account created successfully");
                window.location.href = '/loginuser';
            } else {
                // Display error message
                const result = await response.json();
                if (result.errors && result.errors.length > 0) {
                    result.errors.forEach(error => {
                        showToast(error);
                    });
                } else {
                    showToast("Unknown error occurred");
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showToast("Unable to create account");
        }
    });
});


function showToast(message) {
    // Create a new toast element
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;

    // Add the toast to the container
    const toastContainer = document.getElementById('toast-container');
    toastContainer.appendChild(toast);

    // Fade in the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500); // Remove toast after transition ends
    }, 3000);
}
