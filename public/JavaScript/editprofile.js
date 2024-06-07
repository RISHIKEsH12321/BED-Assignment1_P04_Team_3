document.addEventListener('DOMContentLoaded', async () => {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    console.log('URL Parameter - id:', id);
    
    let originalValues = {};

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

                // Store the original values
                originalValues = {
                    username: account.username,
                    email: account.user_email,
                    phone: account.user_phonenumber,
                    password: account.user_password
                };
            }
            
            document.getElementById('updateForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const user_email = document.getElementById('email').value;
                const user_phonenumber = document.getElementById('phone').value;
                const user_password = document.getElementById('password').value;
                
                console.log('Updating account with:', { username, user_email, user_phonenumber, user_password });
                
                try {
                    const response = await fetch(`/admin/account/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, user_email, user_phonenumber, user_password }),
                    });
                    
                    if (response.ok) {
                        alert('Account updated successfully');
                    } else {
                        alert('Error updating account');
                        console.error('Error response:', await response.text());
                    }
                } catch (error) {
                    console.error('Error updating account:', error);
                }
            });

            // Delete button functionality
            document.getElementById('deleteButton').addEventListener('click', async () => {
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
            });
            
        } catch (error) {
            console.error('Error fetching account:', error);
        }
    } else {
        console.warn('No ID parameter found in URL');
    }
});
