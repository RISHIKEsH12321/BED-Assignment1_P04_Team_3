document.addEventListener('DOMContentLoaded', async () => {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    console.log('URL Parameter - id:', id);

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
                document.getElementById('username').textContent = account.username;
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
                document.getElementById('about_me').textContent = profile.about_me? profile.about_me : `Hello, I'm ${account.username}, and this is about me`;
                document.getElementById('country').textContent = profile.country? profile.country: `Not Specified`;
                document.getElementById('position').textContent = profile.position? profile.position: `Not Specified`;
                // document.getElementById('profileImagePreview').src = `data:image/jpeg;base64,${profile.profile_picture_url}`;
                document.getElementById('profileImagePreview').src = profile.profile_picture_url ? `data:image/jpeg;base64,${profile.profile_picture_url}` : defaultProfilePhotoUrl;
            }

            document.getElementById("toeditprofile").addEventListener("click", function() {
                window.location.href = `/account-profile/${id}`;
            });

            document.getElementById("logoutbtn").addEventListener("click", function() {
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = '/accountselection'; // Redirect to login page after logout
            });

        } catch (error) {
            console.error('Error fetching account:', error);
        }
    } else {
        console.warn('No ID parameter found in URL');
    }
});