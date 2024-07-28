document.addEventListener('DOMContentLoaded', async () => {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    console.log('URL Parameter - id:', id);
    
    let originalValues = {};
    let originalProfile = {};
    let userRole = '';
    let accountUserId = '';

    // Modal elements
    const modal = document.getElementById("securityCodeModal");
    const span = document.getElementsByClassName("close")[0];
    const securityCodeForm = document.getElementById("securityCodeForm");
    let securityCode = '';

    const defaultProfilePhotoUrl = '../images/user.png';

    if (id) {
        try {
            const response = await fetch(`/users/account/${id}`);
            console.log('Fetch response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const account = await response.json();
            console.log('Fetched account:', account);
            
            if (account) {
                document.getElementById('username').value = account.username;
                document.getElementById('email').value = account.user_email;
                document.getElementById('phone').value = account.user_phonenumber;
                // Do not populate the password field initially
                userRole = account.user_role;
                accountUserId = account.user_id;

                // Store the original values
                originalValues = {
                    username: account.username,
                    email: account.user_email,
                    phone: account.user_phonenumber,
                    // Store hashed password for update reference if needed
                    password: account.user_password
                };
            }

            // Fetch profile information
            const profileResponse = await fetch(`/account/profile/${id}`);
            console.log('Fetch response status for profile:', profileResponse.status);
            
            if (!profileResponse.ok) {
                throw new Error('Network response for profile was not ok');
            }
            
            const profile = await profileResponse.json();
            console.log('Fetched profile:', profile);
            
            // Handle profile data as needed
            if (profile) {
                document.getElementById('about_me').value = profile.about_me;
                document.getElementById('country').value = profile.country;
                document.getElementById('position').value = profile.position;
                document.getElementById('profileImagePreview').src = profile.profile_picture_url ? `data:image/jpeg;base64,${profile.profile_picture_url}` : defaultProfilePhotoUrl;

                // Store the original profile values
                originalProfile = {
                    about_me: profile.about_me,
                    country: profile.country,
                    position: profile.position
                };
            }
            
            const attachButton = document.getElementById('attachButton');
            const imageUpload = document.getElementById('imageUpload');
            const profileImagePreview = document.getElementById('profileImagePreview');
            
            attachButton.addEventListener('click', () => {
                imageUpload.click();
            });

            imageUpload.addEventListener('change', () => {
                const file = imageUpload.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        profileImagePreview.src = reader.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Event listener for current password input
            const currentPasswordInput = document.getElementById('current_password');
            const newPasswordSection = document.getElementById('newPasswordSection');

            currentPasswordInput.addEventListener('input', () => {
                if (currentPasswordInput.value.trim() !== '') {
                    // Show the new password section
                    newPasswordSection.style.display = 'block';
                } else {
                    // Hide the new password section
                    newPasswordSection.style.display = 'none';
                }
            });

            document.getElementById('updateForm').addEventListener('submit', async (e) => {
                e.preventDefault();
            
                const userId = localStorage.getItem('user_id');
                const adminId = localStorage.getItem('admin_id');
                const token = localStorage.getItem('token');
            
                if (!userId) {
                    showToast("Not logged in");
                    return;
                }
            
                try {
                    if (userRole === 'admin' && `${userId}` === `${accountUserId}`) {
                        // Admin editing their own profile
                        modal.style.display = "block";
            
                        try {
                            const currentProfileResponse = await fetch(`/account/profile/${userId}`);
                            if (!currentProfileResponse.ok) {
                                throw new Error('Error fetching current user profile');
                            }
            
                            const currentProfile = await currentProfileResponse.json();
                            const currentUserSecurityCode = currentProfile.security_code;
            
                            securityCodeForm.onsubmit = async (e) => {
                                e.preventDefault();
                                const securityCodeInput = document.getElementById('security_code').value;
            
                                if (securityCodeInput !== currentUserSecurityCode) {
                                    alert('Invalid security code');
                                    return;
                                }
            
                                modal.style.display = "none";
                                await handleUpdate(userRole,userId,adminId,token);
                            };
                        } catch (error) {
                            console.error('Error fetching current user profile:', error);
                            showToast('Error fetching current user profile');
                        }
                    } else if (userRole === 'user' && `${userId}` !== `${accountUserId}`){
                        modal.style.display = "block";
            
                        try {
                            const currentProfileResponse = await fetch(`/account/profile/${userId}`);
                            if (!currentProfileResponse.ok) {
                                throw new Error('Error fetching current user profile');
                            }
            
                            const currentProfile = await currentProfileResponse.json();
                            const currentUserSecurityCode = currentProfile.security_code;
            
                            securityCodeForm.onsubmit = async (e) => {
                                e.preventDefault();
                                const securityCodeInput = document.getElementById('security_code').value;
            
                                if (securityCodeInput !== currentUserSecurityCode) {
                                    alert('Invalid security code');
                                    return;
                                }
            
                                modal.style.display = "none";
                                await handleUpdate(userRole,userId,adminId,token);
                            };
                        } catch (error) {
                            console.error('Error fetching current user profile:', error);
                            showToast('Error fetching current user profile');
                        }
                    } else {
                        // Admin editing user's profile or user editing their own profile
                        await handleUpdate(userRole,userId,adminId,token);
                    }
                } catch (error) {
                    showToast(error.message);
                }
            });
            
            async function handleUpdate(userRole, userId, adminId,token) {
                const username = document.getElementById('username').value;
                const user_email = document.getElementById('email').value;
                const user_phonenumber = document.getElementById('phone').value;
                const current_password = document.getElementById('current_password').value.trim();
                const new_password = document.getElementById('new_password').value.trim();
                const confirm_new_password = document.getElementById('confirm_new_password').value.trim();
                const about_me = document.getElementById('about_me').value;
                const country = document.getElementById('country').value;
                const position = document.getElementById('position').value;
            
                let profileImageData = null;
                const imageFile = imageUpload.files[0];
                if (imageFile) {
                    profileImageData = await convertImageToBase64(imageFile);
                } else if (profile.profile_picture_url) {
                    profileImageData = profile.profile_picture_url;
                } else {
                    profileImageData = await convertImageToBase64(defaultProfilePhotoUrl);
                }
            
                console.log('Updating account with:', { username, user_email, user_phonenumber });
                console.log('Updating profile with:', { about_me, country, position, profileImageData });
            
                // Admins can edit without needing password check
                if (userRole !== 'admin' && `${userId}` === `${accountUserId}`) {
                    if (current_password === '' && new_password === '' && confirm_new_password === '') {
                        alert('Please enter your current password to make changes.');
                        return;
                    }

                    try {
                        // Verify the current password
                        const response = await fetch(`/users/check-password`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                currentPassword: current_password,
                                user_id: accountUserId
                            }),
                        });
                
                        const result = await response.json();
                        console.log('Password check result:', result);
                
                        if (result.message !== 'Password is correct') {
                            throw new Error('Current password is incorrect');
                        }
                    } catch (error) {
                        console.error('Error verifying password:', error);
                        alert(error.message || 'Error verifying password');
                        return;
                    }
                } else if(userRole === 'admin' && `${userId}` === `${accountUserId}`){
                    if (current_password === '' && new_password === '' && confirm_new_password === '') {
                        showToast('Please enter your current password to make changes.');
                        return;
                    }

                    try {
                        // Verify the current password
                        const response = await fetch(`/users/check-password`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                currentPassword: current_password,
                                user_id: accountUserId
                            }),
                        });
                
                        const result = await response.json();
                        console.log('Password check result:', result);
                
                        if (result.message !== 'Password is correct') {
                            throw new Error('Current password is incorrect');
                        }
                    } catch (error) {
                        console.error('Error verifying password:', error);
                        alert(error.message || 'Error verifying password');
                        return;
                    }
                }
            
                try {
                    let requestBody = {
                        username,
                        user_email,
                        user_phonenumber,
                        user_id: userId,
                        admin_id: adminId,
                        token,
                    };
            
                    if (new_password !== '' && new_password === confirm_new_password) {
                        requestBody.user_password = new_password;
                    } else if (new_password !== '' && new_password !== confirm_new_password) {
                        throw new Error('New password and confirmation do not match');
                    }
            
                    const updateResponse = await fetch(`/admin/account/${accountUserId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });
                    console.log(requestBody);
            
                    if (!updateResponse.ok) {
                        throw new Error('Error updating account Check User Role');
                    }
            
                    const profileResponse = await fetch(`/account/profile/${accountUserId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ about_me, country, position, profile_picture_base64: profileImageData }),
                    });
            
                    if (profileResponse.ok) {
                        showToast('Account details updated successfully');
                    } else {
                        const errorText = await profileResponse.text();
                        console.error('Profile update error:', errorText);
                        showToast(`Error updating profile: ${errorText}`);
                    }
                } catch (error) {
                    console.error('Error updating account:', error);
                    showToast(error.message || 'Error updating account');
                }
            }

            // Delete button functionality
            document.getElementById('deleteButton').addEventListener('click', async () => {
                const sessionid = localStorage.getItem("admin_id")
                if (!sessionid){
                    alert('Only admins can delete accounts');
                    return
                }

                if (confirm('Are you sure you want to delete this account?')) {
                    try {
                        const response = await fetch(`/admin/account/${id}`, {
                            method: 'DELETE'
                        });
                        
                        if (response.ok) {
                            alert('Account deleted successfully');
                            // Redirect to some other page or perform any other action after deletion if needed
                        } else {
                            alert('Admin Account cannot be deleted');
                            console.error('Error response:', await response.text());
                        }
                    } catch (error) {
                        console.error('Error deleting account:', error);
                    }
                }
            });

            // Reset button functionality
            document.getElementById('resetButton').addEventListener('click', () => {
                document.getElementById('username').value = originalValues.username;
                document.getElementById('email').value = originalValues.email;
                document.getElementById('phone').value = originalValues.phone;
                document.getElementById('current_password').value = '';
                document.getElementById('new_password').value = '';
                document.getElementById('confirm_new_password').value = '';
                document.getElementById('about_me').value = originalProfile.about_me;
                document.getElementById('country').value = originalProfile.country;
                document.getElementById('position').value = originalProfile.position;

                // Hide the new password section
                newPasswordSection.style.display = 'none';
            });

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }

            async function convertImageToBase64(fileOrUrl) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64String = reader.result.split(',')[1];
                        resolve(base64String);
                    };
                    reader.onerror = error => reject(error);

                    if (typeof fileOrUrl === 'string') {
                        fetch(fileOrUrl)
                            .then(response => response.blob())
                            .then(blob => {
                                reader.readAsDataURL(blob);
                            })
                            .catch(error => reject(error));
                    } else {
                        reader.readAsDataURL(fileOrUrl);
                    }
                });
            }

            
        } catch (error) {
            console.error('Error fetching account:', error);
        }
    } else {
        console.warn('No ID parameter found in URL');
    }
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