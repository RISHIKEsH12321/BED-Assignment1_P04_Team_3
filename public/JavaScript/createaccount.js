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

        
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        const formData = new FormData(event.target);
        const data = {
            username: formData.get('username'),
            user_email: formData.get('user_email'),
            user_phonenumber: formData.get('user_phonenumber'),
            user_password: formData.get('user_password'),
            security_code: formData.get('security_code')
        };

        try {
            const response = await fetch('/admin/account/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // If account creation is successful, redirect to /loginadmin
                window.location.href = '/loginadmin';
            } else {
                // If account creation fails, alert the user and redirect to /registeruser
                alert('Unable to create admin account');
                window.location.href = '/registeruser';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Unable to create admin account');
            window.location.href = '/registeruser';
        }
    });
});