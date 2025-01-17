document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const modal = document.getElementById('myModal');
    const closeModal = modal.querySelector('.close');
    const modalMessage = document.getElementById('modalMessage');
    const successLottie = document.getElementById('successLottie');
    const failLottie = document.getElementById('failLottie');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    let result; // Declare result variable here

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const data = {
            username: formData.get('username'),
            user_password: formData.get('user_password')
        };

        try {
            const response = await fetch('/users/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            result = await response.json();
            modal.style.display = 'block';

            if (response.status === 200) {
                const username = data.username;
                const token = result.token;
                modalMessage.textContent = `Login successful! Welcome, ${username}.`;

                successLottie.style.display = 'block';
                failLottie.style.display = 'none';

                const user_id = result.user_id;


                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('token', token);
                    // localStorage.setItem('user_id', user_id);
                    // localStorage.setItem('username', username);

                } else {
                    localStorage.setItem('token', token);
                    // sessionStorage.setItem('user_id', user_id);
                    // sessionStorage.setItem('username', username);
                }

                console.log('User ID:', user_id);
                console.log('Username:', username);

                setTimeout(() => {
                    window.location.href = '/home';
                }, 2000);
            } else {
                modalMessage.textContent = result.message || 'Invalid username or password. Please try again.';

                successLottie.style.display = 'none';
                failLottie.style.display = 'block';

                setTimeout(() => {
                    modal.style.display = 'none';
                }, 4000);
            }
        } catch (error) {
            console.error('Error:', error);
            modalMessage.textContent = 'An error occurred. Please try again.';

            successLottie.style.display = 'none';
            failLottie.style.display = 'block';

            modal.style.display = 'block';

            setTimeout(() => {
                modal.style.display = 'none';
            }, 400);
        }
    });

    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Add event listener to handle "forgot password" link click
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        // Display the forgot password modal
        forgotPasswordModal.style.display = 'block';
    });

    // Get references to elements for forgot password modal
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const forgotPasswordModalMessage = document.getElementById('forgotPasswordModalMessage');
    const forgotPasswordEmailInput = document.getElementById('forgotPasswordEmail');
    const forgotPasswordSubmitButton = document.getElementById('forgotPasswordSubmit');

    // Add event listener to close button in forgot password modal
    const closeForgotPasswordModal = forgotPasswordModal.querySelector('.close');
    closeForgotPasswordModal.addEventListener('click', function() {
        forgotPasswordModal.style.display = 'none';
        clearPasswordFields();
    });

    function clearPasswordFields() {
        const enterPasswordText = document.getElementById('enterPasswordText');
        const newPasswordDiv = document.getElementById('newPasswordDiv');
        const reconfirmPasswordDiv = document.getElementById('reconfirmPasswordDiv');
        const verifyPasswordsDiv = document.getElementById('verifyPasswordsDiv');

        if (enterPasswordText) enterPasswordText.remove();
        if (newPasswordDiv) newPasswordDiv.remove();
        if (reconfirmPasswordDiv) reconfirmPasswordDiv.remove();
        if (verifyPasswordsDiv) verifyPasswordsDiv.remove();
    }

    // Add event listener to handle submission of forgot password form
    forgotPasswordSubmitButton.addEventListener('click', async function(event) {
        event.preventDefault();
        const enteredEmail = forgotPasswordEmailInput.value;
    
        // Construct the URL with email input appended as a query parameter
        const url = `/users/forgotpassword/${encodeURIComponent(enteredEmail)}`;
    
        try {
            // Make a GET request to the constructed URL
            const response = await fetch(url);
    
            if (response.ok) {
                // If the response is successful, parse the JSON
                const data = await response.json();
    
                // Log all the fetched data
                console.log('Fetched data:', data);
    
                if (data.user_email) {
                    // Create new password input fields
                    const enterPasswordText = document.createElement('div');
                    enterPasswordText.textContent = 'Enter Password:';
                    enterPasswordText.id = 'enterPasswordText';

                    const newPasswordInput = document.createElement('input');
                    newPasswordInput.type = 'password';
                    newPasswordInput.placeholder = 'New Password';
                    newPasswordInput.id = 'newPasswordInput';
    
                    const reconfirmPasswordInput = document.createElement('input');
                    reconfirmPasswordInput.type = 'password';
                    reconfirmPasswordInput.placeholder = 'Reconfirm New Password';
                    reconfirmPasswordInput.id = 'reconfirmPasswordInput';
    
                    // Create a button for verifying passwords
                    const verifyPasswordsButton = document.createElement('button');
                    verifyPasswordsButton.textContent = 'Confirm Password';
                    verifyPasswordsButton.type = 'button';
                    verifyPasswordsButton.addEventListener('click', async function() {
                        const newPasswordValue = newPasswordInput.value;
                        const reconfirmPasswordValue = reconfirmPasswordInput.value;
    
                        if (newPasswordValue === reconfirmPasswordValue) {
                            try {
                                // Make a PUT request to update the password
                                const updateResponse = await fetch(`/admin/account/email/${data.user_id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        username: data.username,
                                        user_email: data.user_email,
                                        user_phonenumber: data.user_phonenumber,
                                        user_password: newPasswordValue,
                                    })
                                });
    
                                if (updateResponse.ok) {
                                    alert('Password updated successfully.');
                                    // Optionally, perform any additional actions after successful password update
                                } else {
                                    throw new Error('Failed to update password.');
                                }
                            } catch (error) {
                                console.error('Error updating password:', error);
                                alert('Failed to update password. Please try again.');
                            }
                        } else {
                            alert('Passwords do not match. Please re-enter the passwords.');
                        }
                    });
    
                    // Create a div to contain the new password input fields and the verify button
                    const newPasswordDiv = document.createElement('div');
                    newPasswordDiv.id = 'newPasswordDiv';
                    newPasswordDiv.appendChild(newPasswordInput);
    
                    const reconfirmPasswordDiv = document.createElement('div');
                    reconfirmPasswordDiv.id = 'reconfirmPasswordDiv';
                    reconfirmPasswordDiv.appendChild(reconfirmPasswordInput);
    
                    const verifyPasswordsDiv = document.createElement('div');
                    verifyPasswordsDiv.id = 'verifyPasswordsDiv';
                    verifyPasswordsDiv.appendChild(verifyPasswordsButton);
    
                    // Get the modal-content element
                    const modalContent = document.querySelector('.modal-content');
    
                    // Append the new password divs and the verify button div to the modal-content
                    modalContent.appendChild(enterPasswordText);
                    modalContent.appendChild(newPasswordDiv);
                    modalContent.appendChild(reconfirmPasswordDiv);
                    modalContent.appendChild(verifyPasswordsDiv);
                } else {
                    // If the email is not valid, display an alert message
                    alert('Invalid email. Please enter a valid email.');
                }
            } else {
                // If the response is not successful, throw an error
                throw new Error('Failed to send password reset email.');
            }
        } catch (error) {
            // Log and handle errors
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
    
});
