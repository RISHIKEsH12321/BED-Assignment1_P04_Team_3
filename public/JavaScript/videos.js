const suggestions = ['Agriculture', 'Mr Beast', 'Technology', 'NewJeans', 'Valorant'];
let selectedIndex = -1; // Keep track of the selected suggestion index
let currentVideoId = ''; // Keep track of the video ID being added
let playlists = []; // Store playlists

async function loadVideos(query = 'Agriculture') {
    try {
        const response = await fetch(`/youtube/search?query=${query}`);
        const data = await response.json();

        const videoList = document.getElementById('videoList');
        videoList.innerHTML = '';

        data.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.className = 'video';
            videoElement.innerHTML = `
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <h3>${video.snippet.title}</h3>
                <button onclick="showPlaylistDialog('${video.id.videoId}', this)">Add to Playlist</button>

            `;
            videoList.appendChild(videoElement);
        });
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

async function fetchPlaylists() {
    const token = localStorage.getItem('token'); // Replace 'token' with the actual key for your token
    
    try {
        const response = await fetch('/youtube/allplaylist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token }), // Include the token in the request body
        });
        const data = await response.json();
        playlists = data; // Store playlists
        populatePlaylistDropdown();
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
}

function populatePlaylistDropdown() {
    const playlistDropdown = document.getElementById('playlistDropdown');
    playlistDropdown.innerHTML = ''; // Clear previous options

    playlists.forEach(playlist => {
        const option = document.createElement('option');
        option.value = playlist.playlist_id;
        option.textContent = playlist.title;
        playlistDropdown.appendChild(option);
    });
}

function showPlaylistDialog(videoId, buttonElement) {
    currentVideoId = videoId; // Set the current video ID
    fetchPlaylists(); // Fetch playlists and populate dropdown

    const playlistDialog = document.getElementById('playlistDialog');

    // Calculate the position of the button
    const rect = buttonElement.getBoundingClientRect();
    const dialog = playlistDialog.getBoundingClientRect();

    // Set the position of the dialog
    playlistDialog.style.position = 'absolute'; // Ensure the dialog is positioned absolutely
    playlistDialog.style.top = `${rect.bottom + window.scrollY}px`; // Position below the button
    playlistDialog.style.left = `${rect.left}px`; // Align with the button

    playlistDialog.style.transform = `translateX(${-120}px)`;

    playlistDialog.style.display = 'block'; // Show the dialog
}


async function addVideoToPlaylist() {
    const playlistId = document.getElementById('playlistDropdown').value;
    try {
        const response = await fetch('/youtube/addvideo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playlistId: playlistId, videoId: currentVideoId }),
        });
        const result = await response.json();
        alert(result.message); // Show a message to the user
        document.getElementById('playlistDialog').style.display = 'none'; // Hide the dialog
    } catch (error) {
        console.error('Error adding video to playlist:', error);
    }
}

function handleSearch(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        if (selectedIndex !== -1) {
            // If a suggestion is selected, use it
            selectSuggestion(selectedIndex);
        } else {
            const query = document.getElementById('searchQuery').value;
            loadVideos(query);
            document.getElementById('suggestions').style.display = 'none'; // Hide suggestions after selection
        }
        // Clear the input field after search
        document.getElementById('searchQuery').value = '';
    }
}

function handleInputClick() {
    showSuggestions();
}

function handleKeyNavigation(event) {
    const suggestionsContainer = document.getElementById('suggestions');
    const suggestionDivs = Array.from(suggestionsContainer.children);

    if (event.key === 'ArrowDown') {
        if (suggestionDivs.length > 0) {
            selectedIndex = (selectedIndex + 1) % suggestionDivs.length;
            highlightSuggestion(selectedIndex);
            event.preventDefault(); // Prevent default scrolling behavior
        }
    } else if (event.key === 'ArrowUp') {
        if (suggestionDivs.length > 0) {
            selectedIndex = (selectedIndex - 1 + suggestionDivs.length) % suggestionDivs.length;
            highlightSuggestion(selectedIndex);
            event.preventDefault(); // Prevent default scrolling behavior
        }
    } else if (event.key === 'Enter') {
        if (selectedIndex !== -1) {
            selectSuggestion(selectedIndex);
            event.preventDefault(); // Prevent default behavior
        }
    }
}

function highlightSuggestion(index) {
    const suggestionsContainer = document.getElementById('suggestions');
    const suggestionDivs = Array.from(suggestionsContainer.children);
    
    suggestionDivs.forEach(div => div.classList.remove('highlighted'));
    if (index >= 0 && index < suggestionDivs.length) {
        suggestionDivs[index].classList.add('highlighted');
    }
}

window.onload = () => {
    loadVideos();
};

// Add event listeners
document.getElementById('searchQuery').addEventListener('keypress', handleSearch);
document.getElementById('searchButton').addEventListener('click', handleSearch);
document.getElementById('searchQuery').addEventListener('click', handleInputClick);
document.addEventListener('keydown', handleKeyNavigation); // Add keydown event listener for navigation

document.getElementById('addToPlaylistSubmit').addEventListener('click', addVideoToPlaylist);

document.addEventListener('click', (event) => {
    const suggestionsContainer = document.getElementById('suggestions');
    if (!suggestionsContainer.contains(event.target) && event.target.id !== 'searchQuery') {
        suggestionsContainer.style.display = 'none';
    }
});








// async function addVideoToPlaylist(videoId, playlistId) {
//     try {
//         const response = await fetch('/youtube/addvideo', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ playlistId: playlistId, videoId: videoId }),
//         });
//         const result = await response.json();
//         alert(result.message); // Show a message to the user
//     } catch (error) {
//         console.error('Error adding video to playlist:', error);
//     }
// }