const sql = require("mssql");
const dbConfig = require("../dbConfig");

// User Profile model (Ye Chyang)
class Profile {
    constructor (profile_id, user_id, about_me, country, position, security_code, profile_picture_url){
        this.profile_id = profile_id;
        this.user_id = user_id;
        this.about_me = about_me;
        this.country = country;
        this.position = position;
        this.security_code = security_code;
        this.profile_picture_url = profile_picture_url;
    };


    static async getUserProfile(user_id){
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Profile WHERE user_id = @user_id`

        const request = connection.request();
        request.input("user_id", user_id);
        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset.length > 0) {
            const profile = result.recordset[0];
            return new Profile(profile.profile_id, profile.user_id, profile.about_me, profile.country, profile.position, profile.security_code, profile.profile_picture_url);
        } else {
            return null;
        }
    }

    static async updateUserProfile(user_id, newprofile){
        const currentprofile = await this.getUserProfile(user_id);
        const connection = await sql.connect(dbConfig);

        if (!currentprofile) {
            throw new Error("Profile not found");
        }

        const sqlQuery = `UPDATE Profile SET about_me = @about_me, country = @country, position = @position,
                            security_code = @security_code, profile_picture_url = @profile_picture_url WHERE user_id = @user_id`;

        const request = connection.request();
        request.input("user_id" , user_id);
        request.input("about_me", newprofile.about_me || currentprofile.about_me);
        request.input("country", newprofile.country || currentprofile.country);
        request.input("position", newprofile.position || currentprofile.position);
        request.input("security_code", newprofile.security_code || currentprofile.security_code);
        // request.input("profile_picture_url", newprofile.profile_picture_url || currentprofile.profile_picture_url);

        if (newprofile.profile_picture_base64) {
            const base64Data = newprofile.profile_picture_base64.replace(/^data:image\/jpeg;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            request.input("profile_picture_url", buffer);
        } else {
            request.input("profile_picture_url", currentprofile.profile_picture_url);
        }

        await request.query(sqlQuery);
        
        connection.close();

        return this.getUserProfile(user_id);
    }

    static async bufferToBase64(buffer) {
        return buffer.toString('base64');
    }
}

module.exports = Profile;