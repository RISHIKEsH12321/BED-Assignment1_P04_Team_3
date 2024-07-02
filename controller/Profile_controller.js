//Profile Controller (Ye Chyang)
const Profile = require("../models/Profile_model")

const getUserProfile = async (req,res) => {
    const userid = parseInt(req.params.id);

    try{
        const user = await Profile.getUserProfile(userid);
        if (!user) {
          return res.status(404).send("User profile not found");
        }

        if (user.profile_picture_url) {
            user.profile_picture_url = await Profile.bufferToBase64(user.profile_picture_url);
        }
        res.json(user);
    } catch (error){
        console.error(error);
        res.status(500).send("Error retrieving User"); 
    }
}

const updateUserProfile = async (req,res) => {
    const userId = parseInt(req.params.id);
    const newUserData = req.body;

    try {
        const updatedUser = await Profile.updateUserProfile(userId, newUserData);
        if (!updatedUser) {
          return res.status(404).send("User profile not found");
        }
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating User");
    }
}


module.exports = {
    getUserProfile,
    updateUserProfile,
}