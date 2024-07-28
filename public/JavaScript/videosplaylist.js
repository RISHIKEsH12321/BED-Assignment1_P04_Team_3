document.addEventListener('DOMContentLoaded', () => {
    const openModalButton = document.getElementById('openModalButton');
    const modal = document.getElementById('playlistModal');
    const closeButton = document.querySelector('.close-button');
    const playlistContainer = document.getElementById('playlistContainer');

    const fetchPlaylists = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('No authentication token found. Please log in again.');
            return;
        }

        try {
            const response = await fetch('/youtube/allplaylist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            displayPlaylists(data);
        } catch (error) {
            console.error('Failed to fetch playlists:', error);
            alert('Failed to fetch playlists: ' + error.message);
        }
    };

    // Function to display playlists
    const displayPlaylists = (playlists) => {
        playlistContainer.innerHTML = ''; // Clear any existing content
    
        if (playlists.length === 0) {
            playlistContainer.innerHTML = '<p>No playlists found.</p>';
            return;
        }
    
        playlists.forEach(playlist => {
            const playlistElement = document.createElement('div');
            playlistElement.classList.add('playlist-item');
            playlistElement.innerHTML = `
                <div class="playlist-box">
                    <h3 class="playlist-title">${playlist.title}</h3>
                    <p class="playlist-description">${playlist.description}</p>
                    <button class="playlist-button" data-playlist-id="${playlist.playlist_id}">View Playlist</button>
                </div>
            `;
            playlistContainer.appendChild(playlistElement);
        });

        document.querySelectorAll('.playlist-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const playlistId = event.target.getAttribute('data-playlist-id');
                window.location.href = `/playlist/${playlistId}`;
            });
        });
    };

    // Open modal
    openModalButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.getElementById('playlistForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        // Retrieve form values
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('No authentication token found. Please log in again.');
            return;
        }

        try {
            // Send POST request to create playlist
            const response = await fetch('/youtube/playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    title: title,
                    description: description
                })
            });

            // Check if the response is okay
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            // Parse response data
            const data = await response.json();
            alert('Playlist created successfully!');
            console.log(data); // Handle the response data as needed

            // Optionally, close the modal after successful creation
            document.getElementById('playlistModal').style.display = 'none';

            // Clear form fields
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';

            fetchPlaylists();
        } catch (error) {
            console.error('Failed to create playlist:', error);
            alert('Failed to create playlist: ' + error.message);
        }
    });

    fetchPlaylists();
});
