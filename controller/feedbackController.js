const Feedback = require("../models/feedback");

const getAllFeedback = async (req, res) => {
    try{
        const feedbacks = await Feedback.getAllFeedback();
        res.json(feedbacks);
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error retrieving feedbacks");
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
    getAllFeedback,
    createFeedback
}