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

module.exports = {
    getOngoingFeedback,
    getResolvedFeedback,
    getFeedbackById,
    createFeedback
}