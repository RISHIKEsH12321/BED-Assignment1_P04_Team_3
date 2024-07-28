// Define getPlaylistIdFromURL in the global scope
const getPlaylistIdFromURL = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
};

// Define fetchPlaylistDetails in the global scope
const fetchPlaylistDetails = async (playlistId) => {
    try {
        const response = await fetch(`/youtube/playlist/${playlistId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        displayPlaylistDetails(data);
    } catch (error) {
        console.error('Failed to fetch playlist details:', error);
        showToast('Failed to fetch playlist details: ' + error.message);
    }
};

// Define displayPlaylistDetails in the global scope
const displayPlaylistDetails = (playlist) => {
    document.getElementById('playlistTitle').textContent = 'Playlist Details';

    // Assuming playlist is an array of video objects
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = ''; // Clear existing content

    if (playlist.length > 0) {
        playlist.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.classList.add('video-item');
            videoElement.innerHTML = `
                <div class="video-header">
                    <h3>${video.snippet.title || 'No Title'}</h3>
                    <button class="menu-button">⋮</button>
                </div>
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
            `;
            videoList.appendChild(videoElement);

            const menuButton = videoElement.querySelector('.menu-button');
            menuButton.addEventListener('click', () => {
                showModal(video.id);
            });
        });
    } else {
        videoList.innerHTML = '<p>No videos found in this playlist.</p>';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const playlistId = getPlaylistIdFromURL();
    console.log('Retrieved Playlist ID:', playlistId); // Log the playlist ID to the console
    fetchPlaylistDetails(playlistId);
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

function showModal(videoId) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    const cancelButton = document.getElementById('cancelButton');
    const removeButton = document.getElementById('removeButton');
    const closeButton = document.getElementById('closeButton');

    closeButton.onclick = () => {
        modal.style.display = 'none';
    }

    cancelButton.onclick = () => {
        modal.style.display = 'none';
    };

    removeButton.onclick = async () => {
        const playlistId = getPlaylistIdFromURL();
        try {
            const response = await fetch('/youtube/remove-video-from-playlist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId, videoId })
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
    
            const result = await response.json();
            showToast(result.message);
            fetchPlaylistDetails(playlistId); // Refresh the playlist details
        } catch (error) {
            console.error('Failed to remove video:', error);
            showToast('Failed to remove video: ' + error.message);
        } finally {
            modal.style.display = 'none';
        }
    };
}
