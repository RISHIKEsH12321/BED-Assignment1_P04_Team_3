const Feedback = require("../models/feedback");

const getOngoingFeedback = async (req, res) => {
    try{
        const feedbacks = await Feedback.getOngoingFeedback();
        res.json(feedbacks);
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error retrieving feedbacks");
    }
};

const getResolvedFeedback = async (req, res) => {
    try{
        const feedbacks = await Feedback.getResolvedFeedback();
        res.json(feedbacks);
    }catch(error){
        console.error(error);
        res.status(500).send("Error retrieving feedbacks");
    }
}

const getFeedbackById = async (req, res) => {
    const feedbackId = parseInt(req.params.id);
    try {
        const feedback = await Feedback.getFeedbackById(feedbackId);
        if(!feedback) {
            return res.status(404).send("Feedback not found");
        }
        res.json(feedback);
    } catch(error) {
        console.error(error);
        res.status(500).send("Error in retrieving feedback");
    }
};

const createFeedback = async (req, res) => {
    const newFeedback = req.body;
    try {
        const createFeedback = await Feedback.createFeedback(newFeedback);
        res.status(201).json(createFeedback);
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error creating feedback");
    }
};

const updateResolve = async (req, res) => {
    const feedbackId = parseInt(req.params.id);
    const newResolve = req.body;

    try{
        const updatedfeedback = await Feedback.updateResolve(feedbackId, newResolve);
        if(!updatedfeedback){
            return res.status(404).send("Feedback not found");
        }
        res.json(updatedfeedback);
    } catch(error){
        console.error(error);
        res.status(500).send("Error updating feedback");
    }
};

const updateFavourite = async (req, res) => {
    const feedbackId = parseInt(req.params.id);
    const newFav = req.body;

    try{
        const updatedfeedback = await Feedback.updateFavourite(feedbackId, newFav);
        if(!updatedfeedback){
            return res.status(404).send("Feedback not found");
        }
        res.json(updatedfeedback);
    } catch(error){
        console.error(error);
        res.status(500).send("Error updating feedback");
    }
};

const getFavourite = async (req, res) => {
    try{
        const feedbacks = await Feedback.getFavourite();
        res.json(feedbacks);
    }catch(error){
        console.error(error);
        res.status(500).send("Error retrieving feedbacks");
    }
}

const deleteFeedback = async (req, res) => {
    const feedbackId = parseInt(req.params.id);

    try{
        const success = await Feedback.deleteFeedback(feedbackId);
        if (!success){
            return res.status(404).send("Feedback not found");
        }
        res.status(204).send();
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error deleting feedback");
    }
}

module.exports = {
    getOngoingFeedback,
    getResolvedFeedback,
    getFeedbackById,
    createFeedback,
    updateResolve,
    updateFavourite,
    getFavourite,
    deleteFeedback
}