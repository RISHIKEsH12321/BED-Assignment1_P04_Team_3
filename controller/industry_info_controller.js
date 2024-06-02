const Industry_Info = require("../models/industry_info");
const Industry_Challenges = require("../models/industry_challenges");

const getIndustryInfo = async (req, res) => {
    const industry_id = parseInt(req.params.id);
    try {
      const data = await Industry_Info.getIndustryInfo(industry_id);
      const challenge_data = await Industry_Challenges.getIndustryChallenges(industry_id);
      if (!data && !challenge_data) {
        return res.status(404).send("Industry not found");
      }
      const result = {
        industry: data,
        challenges: challenge_data
    };
    res.json(result);

    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving Industry_Info");
    }
};

const createNewChallenge = async (req, res) => {
    const newChallenge = req.body;
    console.log(newChallenge);
    try {
      const data = await Industry_Challenges.createNewChallenge(newChallenge);
      if (!data) {
        return res.status(404).send("Challenge not found");
      }
    res.json(data);

    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating Challenge");
    }
};


const updateChallenge = async (req, res) => {
    const newChallenge = req.body;
    console.log(newChallenge);
    try {
      const data = await Industry_Challenges.updateChallenge(newChallenge);
      if (!data) {
        return res.status(404).send("Challenge not found");
      }
    res.json(data);

    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating Challenge");
    }
};

const updateIndustryInfo = async (req, res) => {
    const industry_id = parseInt(req.params.id);
    const newIndustryIntro = req.body.introduction;
    try {
      const data = await Industry_Info.updateIndustryInfo(industry_id, newIndustryIntro);
      if (!data) {
        return res.status(404).send("Industry not found");
      }
    res.json(data);

    } catch (error) {
      console.error(error);
      res.status(500).send("Error Updating Industry");
    }
};

const deleteIndustryChallenge = async (req, res) => {
    const industry_id = parseInt(req.params.id);
    try {
      const data = await Industry_Challenges.deleteIndustryChallenge(industry_id);
      if (!data) {
        return res.status(404).send("Challenge not found");
      }
    res.json(data);

    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting Challenge");
    }
};



module.exports = {
    getIndustryInfo,
    deleteIndustryChallenge,
    createNewChallenge,
    updateChallenge,
    updateIndustryInfo
};
