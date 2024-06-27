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
                document.getElementById('password').value = account.user_password;
                userRole = account.user_role;
                accountUserId = account.user_id;

                // Store the original values
                originalValues = {
                    username: account.username,
                    email: account.user_email,
                    phone: account.user_phonenumber,
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

            document.getElementById('updateForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const userId = sessionStorage.getItem('user_id');

                if (!userId){
                    alert("Not logged in")
                    return
                }
                
                // Check if the logged-in user has administrative privileges
                if (userRole === 'admin') {
                    // Check if the user is updating their own account
                    if (`${userId}` === `${accountUserId}`) {
                        // Show modal for security code input
                        modal.style.display = "block";

                        try {
                            const currentProfileResponse = await fetch(`/account/profile/${userId}`);
                            if (!currentProfileResponse.ok) {
                                throw new Error('Error fetching current user profile');
                            }

                            const currentProfile = await currentProfileResponse.json();

                            // Store the current user's security code
                            const currentUserSecurityCode = currentProfile.security_code;

                            securityCodeForm.onsubmit = async (e) => {
                                e.preventDefault();
                                securityCode = document.getElementById('security_code').value;

                                // Check if the entered security code matches the fetched one
                                if (securityCode !== currentUserSecurityCode) {
                                    alert('Invalid security code');
                                    return;
                                }

                                modal.style.display = "none";  // Close the modal

                                // Continue with update process
                                await handleUpdate();
                            };
                        } catch (error) {
                            console.error('Error fetching current user profile:', error);
                            alert('Error fetching current user profile');
                        }
                    } else {
                        alert('Cannot update other admin accounts');
                        return;
                    }
                } else {
                    if (userRole === 'user'){
                        if (`${userId}` !== `${accountUserId}`){
                            modal.style.display = "block";

                            try {
                                const currentProfileResponse = await fetch(`/account/profile/${userId}`);
                                if (!currentProfileResponse.ok) {
                                    throw new Error('Error fetching current user profile');
                                }
    
                                const currentProfile = await currentProfileResponse.json();
    
                                // Store the current user's security code
                                const currentUserSecurityCode = currentProfile.security_code;
    
                                securityCodeForm.onsubmit = async (e) => {
                                    e.preventDefault();
                                    securityCode = document.getElementById('security_code').value;
    
                                    // Check if the entered security code matches the fetched one
                                    if (securityCode !== currentUserSecurityCode) {
                                        alert('Invalid security code');
                                        return;
                                    }
    
                                    modal.style.display = "none";  // Close the modal
    
                                    // Continue with update process
                                    await handleUpdate();
                                };
                            } catch (error) {
                                console.error('Error fetching current user profile:', error);
                                alert('Error fetching current user profile');
                            }
                        }
                        else {
                            await handleUpdate();
                        }
                    }
                }
            });

            async function handleUpdate() {
                const username = document.getElementById('username').value;
                const user_email = document.getElementById('email').value;
                const user_phonenumber = document.getElementById('phone').value;
                const user_password = document.getElementById('password').value;
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
                    // Use default image if no new image is uploaded and no profile image exists
                    profileImageData = await convertImageToBase64(defaultProfilePhotoUrl);
                }

                console.log('Updating account with:', { username, user_email, user_phonenumber, user_password });
                console.log('Updating profile with:', { about_me, country, position });
                console.log('Updating profile image:', profileImageData);

                try {
                    const response = await fetch(`/admin/account/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, user_email, user_phonenumber, user_password }),
                    });

                    if (!response.ok) {
                        throw new Error('Error updating account');
                    }

                    // Update profile information
                    const profileResponse = await fetch(`/account/profile/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ about_me, country, position, profile_picture_base64: profileImageData }),
                    });

                    if (profileResponse.ok) {
                        alert('Account updated successfully');
                    } else {
                        alert('Error updating profile');
                        console.error('Error response:', await profileResponse.text());
                    }
                } catch (error) {
                    console.error('Error updating account:', error);
                }
            }

            // Delete button functionality
            document.getElementById('deleteButton').addEventListener('click', async () => {
                const sessionid = sessionStorage.getItem("admin_id")
                if (!sessionid){
                    alert('Only admins can delete accounts');
                    return
                }
                // if (userRole !== 'admin'){
                //     alert('Only admins can delete accounts');
                //     return
                // }
                if (confirm('Are you sure you want to delete this account?')) {
                    try {
                        const response = await fetch(`/admin/account/${id}`, {
                            method: 'DELETE'
                        });
                        
                        if (response.ok) {
                            alert('Account deleted successfully');
                            // Redirect to some other page or perform any other action after deletion if needed
                        } else {
                            alert('Error deleting account');
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
                document.getElementById('password').value = originalValues.password;
                document.getElementById('about_me').value = originalProfile.about_me;
                document.getElementById('country').value = originalProfile.country;
                document.getElementById('position').value = originalProfile.position;
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
