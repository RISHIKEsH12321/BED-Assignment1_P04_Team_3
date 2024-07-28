document.addEventListener('DOMContentLoaded', () => {
    const getPlaylistIdFromURL = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };

    const fetchPlaylistDetails = async (playlistId) => {
        try {
            const response = await fetch(`/youtube/playlist/${playlistId}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data)
            displayPlaylistDetails(data);
        } catch (error) {
            console.error('Failed to fetch playlist details:', error);
            alert('Failed to fetch playlist details: ' + error.message);
        }
    };

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
                    <h3>${video.snippet.title || 'No Title'}</h3>
                    <p>${video.snippet.description || 'No Description'}</p>
                    <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">Watch Video</a>
                    <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}" />
                `;
                videoList.appendChild(videoElement);
            });
        } else {
            videoList.innerHTML = '<p>No videos found in this playlist.</p>';
        }
    };

    const playlistId = getPlaylistIdFromURL();
    console.log('Retrieved Playlist ID:', playlistId); // Log the playlist ID to the console
    fetchPlaylistDetails(playlistId);
});
