const YouTubeModel = require('../models/YoutubeModel');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRole = require("../middleware/validateRole");
const JWT_SECERT = process.env.JWT_SECERT;

// Initialize the model instance
const youtubeModel = new YouTubeModel();

// Function to get video details
const getVideoDetails = async (req, res) => {
    const videoId = req.params.videoId;
    try {
        const videoDetails = await youtubeModel.getVideoDetails(videoId);
        res.json(videoDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to search for videos
const searchVideos = async (req, res) => {
    const query = req.query.query;
    try {
        const videos = await youtubeModel.searchVideos(query);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to create a playlist
const createPlaylist = async (req, res) => {
    const { token, title, description } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECERT);
        const user_id = decoded.user_id; // Adjust according to your token's payload structure

        // Call the createPlaylist method with the user_id
        const playlist = await youtubeModel.createPlaylist(user_id, title, description);
        res.status(201).json(playlist);
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllPlaylist = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECERT);
        const userId = decoded.user_id;

        // Fetch playlists for the user
        const playlists = await youtubeModel.getAllPlaylist(userId);
        res.status(200).json(playlists); 
    } catch (error) {
        console.error('Error decoding token or fetching playlists:', error);
        res.status(500).json({ message: 'Internal server error' }); // Updated to 500 for internal server errors
    }
};

const addVideoToPlaylist = async (req, res) => {
    const { playlistId, videoId } = req.body;

    try {
        const message = await youtubeModel.addVideoToPlaylist(playlistId, videoId);
        res.json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPlaylistVideos = async (req, res) => {
    const playlistId = req.params.playlist_id;
    try {
        // Fetch video IDs from the playlist
        const videoIdsResult = await youtubeModel.getPlaylistVideos(playlistId);

        // Check if no video IDs were found
        if (videoIdsResult.length === 0) {
            return res.status(404).json({ message: 'No videos found for this playlist' });
        }
        
        const videoIds = videoIdsResult.map(v => v.video_id);

        // // Fetch video details using the video IDs
        const videoDetails = await youtubeModel.getVideoDetails(videoIds);

        // Return the video details as JSON response
        res.json(videoDetails);
    } catch (error) {
        console.error('Error fetching playlist videos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deletePlaylist = async (req, res) => {
    const { playlistId } = req.body;

    try {
        // Call the deletePlaylist method from the model
        await youtubeModel.deletePlaylist(playlistId);
        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updatePlaylist = async (req, res) => {
    const { playlistId, title, description } = req.body;

    try {
        const message = await youtubeModel.updatePlaylist(playlistId, title, description);
        res.json({ message });
    } catch (error) {
        console.error('Error updating playlist:', error);
        res.status(500).json({ message: error.message });
    }
};

const removeVideoFromPlaylist = async (req, res) => {
    const { playlistId, videoId } = req.body;

    try {
        const message = await youtubeModel.removeVideoFromPlaylist(playlistId, videoId);
        res.json({ message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export the functions for use in routes
module.exports = {
    getVideoDetails,
    searchVideos,
    createPlaylist,
    getAllPlaylist,
    addVideoToPlaylist,
    getPlaylistVideos,
    deletePlaylist,
    updatePlaylist,
    removeVideoFromPlaylist
};
