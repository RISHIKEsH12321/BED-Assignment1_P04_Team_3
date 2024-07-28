const { google } = require('googleapis');
const dbConfig = require("../dbConfig");
const sql = require("mssql");
const jwt = require('jsonwebtoken');

class YouTubeModel {
    constructor() {
        this.apiKey = process.env.API_KEY_YOUTUBE;
        this.youtube = google.youtube({
            version: 'v3',
            auth: this.apiKey
        });
    }

    async getVideoDetails(videoId) {
        try {
            const response = await this.youtube.videos.list({
                part: 'snippet,contentDetails,statistics',
                id: videoId
            });
            return response.data.items[0];
        } catch (error) {
            throw new Error('Error fetching video details: ' + error.message);
        }
    }

    async searchVideos(query) {
        try {
            const response = await this.youtube.search.list({
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 2
            });
            return response.data.items;
        } catch (error) {
            throw new Error('Error searching videos: ' + error.message);
        }
    }

    async createPlaylist(userId, title, description) {
        const connection = await sql.connect(dbConfig);

        try {
            const sqlQuery = `
                INSERT INTO playlists (user_id, title, description)
                VALUES (@user_id, @title, @description); SELECT SCOPE_IDENTITY() AS playlist_id;
            `;

            const request = connection.request();
            request.input('user_id', sql.Int, userId);
            request.input('title', sql.NVarChar, title);
            request.input('description', sql.NVarChar, description);
            
            const result = await request.query(sqlQuery);
            const playlistId = result.recordset[0].id;
            
            return {
                id: playlistId,
                userId,
                title,
                description
            };
        } catch (error) {
            throw new Error('Error creating playlist: ' + error.message);
        } finally {
            connection.close();
        }
    }

    async getAllPlaylist(userId) {
        const connection = await sql.connect(dbConfig);

        try {
            const sqlQuery = `SELECT * FROM playlists WHERE user_id = @user_id`;
            const request = connection.request();
            request.input('user_id', sql.Int, userId); // Adjust the type based on your database schema
            const result = await request.query(sqlQuery);

            return result.recordset;
        } catch (err) {
            console.error('Error getting playlists:', err);
            throw err; // Rethrow the error to be handled by the controller
        } finally {
            // Ensure the connection is always closed
            connection.close();
        }
    }

    async addVideoToPlaylist(playlistId, videoId) {
        const connection = await sql.connect(dbConfig);

        try {
            const sqlQuery = `
                INSERT INTO playlist_video (playlist_id, video_id)
                VALUES (@playlist_id, @video_id); SELECT SCOPE_IDENTITY() AS playlist_video_id;
            `;
            const request = connection.request();
            request.input('playlist_id', sql.Int, playlistId);
            request.input('video_id', videoId);

            await request.query(sqlQuery);
            return 'Video added to playlist successfully';
        } catch (error) {
            throw new Error('Error adding video to playlist: ' + error.message);
        } finally {
            connection.close();
        }
    }

    async getPlaylistVideos(playlistId) {
        const connection = await sql.connect(dbConfig);
        
        try {
            const sqlQuery = `
                SELECT video_id
                FROM playlist_video
                WHERE playlist_id = @playlist_id
            `;
            const request = connection.request();
            request.input('playlist_id', sql.VarChar, playlistId); // Specify the parameter type
    
            const result = await request.query(sqlQuery);
            return result.recordset; // Returns an array of video IDs
        } catch (error) {
            throw new Error('Error fetching playlist videos: ' + error.message);
        } finally {
            connection.close();
        }
    }
    
    async getVideoDetails(videoIds) {
        try {
            const response = await this.youtube.videos.list({
                part: 'snippet,contentDetails,statistics',
                id: videoIds.join(',')
            });
            return response.data.items;
        } catch (error) {
            throw new Error('Error fetching video details: ' + error.message);
        }
    }

    // Delete a playlist and its associated videos
    async deletePlaylist(playlistId) {
        const connection = await sql.connect(dbConfig);

        try {
            const sqlQuery = `DELETE FROM playlists WHERE playlist_id = @playlist_id`;

            const request = connection.request();
            request.input("playlist_id", sql.Int, playlistId);

            await request.query(sqlQuery);

            return 'Playlist deleted successfully';
        } catch (error) {
            throw new Error('Error deleting playlist: ' + error.message);
        } finally {
            connection.close();
        }
    }

    async updatePlaylist(playlistId, title, description) {
        const connection = await sql.connect(dbConfig);
    
        try {
            const sqlQuery = `
                UPDATE playlists
                SET title = @title, description = @description
                WHERE playlist_id = @playlist_id
            `;
    
            const request = connection.request();
            request.input("playlist_id", sql.Int, playlistId);
            request.input("title", sql.VarChar, title);
            request.input("description", sql.VarChar, description);
    
            await request.query(sqlQuery);
    
            return 'Playlist updated successfully';
        } catch (error) {
            throw new Error('Error updating playlist: ' + error.message);
        } finally {
            connection.close();
        }
    }

    async removeVideoFromPlaylist(playlistId, videoId) {
        const connection = await sql.connect(dbConfig);
    
        try {
            const sqlQuery = `
                DELETE FROM playlist_video 
                WHERE playlist_id = @playlist_id AND video_id = @video_id
            `;
            const request = connection.request();
            request.input('playlist_id', playlistId);
            request.input('video_id', videoId);
    
            await request.query(sqlQuery);
            return 'Video removed from playlist successfully';
        } catch (error) {
            throw new Error('Error removing video from playlist: ' + error.message);
        } finally {
            connection.close();
        }
    }
    
}

module.exports = YouTubeModel;
