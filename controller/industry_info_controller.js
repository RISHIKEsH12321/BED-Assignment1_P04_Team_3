const Industry_Info = require("../models/industry_info");
const Industry_Challenges = require("../models/industry_challenges");
const validateRole = require("../middleware/validateRole");

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom"); 

const getAllIndustryInfo = async (req, res) => {
    try {
    const data = await Industry_Info.getAllIndustryInfo();
    const challenge_data = await Industry_Challenges.getAllIndustryChallenges();
    const result = {
      industry:data,
      challanges:challenge_data
    }
    console.log(result)
    // Check if data or challenge_data is null or undefined
    if (!data || !challenge_data || !data.length || !challenge_data.length) {
      return res.status(404).send("Industries not found");
    }
    res.status(200).send(result);
  } catch (error) {
    // console.log(error);
    res.status(500).send("Error retrieving Industries");
  }
}

const getIndustryInfo = async (req, res) => {
    const industry_id = parseInt(req.params.id);
    try {
      const data = await Industry_Info.getIndustryInfo(industry_id);
      const challenge_data = await Industry_Challenges.getIndustryChallenges(industry_id);
      if (!data || !challenge_data) {
        console.log(data)
        return res.status(404).send("Industry not found");
      }
      const result = {
        industry: data,
        challenges: challenge_data
    };
    // res.send(result.industry.industry_name);
    const filePath = path.join(__dirname, "../public", "html", "industry.html");
    console.log("File path is " + filePath);
    // Read the index.html file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading industry.html file:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Create a new JSDOM instance
        const dom = new JSDOM(data);

        // Access the document object
        const document = dom.window.document;
        
        // Get the main_intro container and set its bg image
        const mainIntro = document.getElementById("main_intro");
        mainIntro.style.backgroundImage = `url(../../images/industry${industry_id}.jpg)`;

        //Get the quiz btn and sets it redirect link
        const quizBtn = document.getElementById("QuizButtonA");
        quizBtn.href = `/users/quiz/${industry_id}`;

        // Populate Industry Name
        const industryName = document.getElementById("IndustryName");
        if (industryName) {
          industryName.textContent=result.industry.industry_name;
        }
        // Populate Industry Intro
        const industryIntro = document.getElementById("IndustryIntro");
        if (industryIntro){
          industryIntro.textContent = result.industry.introduction;
        }

        
        const ChallengeIntro = document.getElementById("ChallengeIntro");
        const ChallengeContainer = document.getElementById("ChallengeContainer");
        if (ChallengeIntro){
          var challengesArray = result.challenges[0];

          for (var i = 0;i<challengesArray.length;i++){
            //Challenge Intro
            var ChallengeIntroNo  = document.createElement("div");
            ChallengeIntroNo.textContent= i + 1;
            ChallengeIntroNo.id = "ChallengeIntroNo";

            var ChallengeIntroTitle = document.createElement("div");
            ChallengeIntroTitle.textContent = challengesArray[i].challenge_name;
            ChallengeIntroTitle.id = "ChallengeIntroTitle";

            var ChallengeIntroDescription = document.createElement("div");
            ChallengeIntroDescription.textContent = challengesArray[i].challenge_description;
            ChallengeIntroDescription.id = "ChallengeIntroDescription"

            var ChallengeIntroContainer = document.createElement("div");
            ChallengeIntroContainer.id = "ChallengeIntroContainer";
            ChallengeIntroContainer.classList.add("hidden");
    
            var ChallengeNameDesContainer = document.createElement("div");
            ChallengeNameDesContainer.id = "ChallengeNameDesContainer";
            ChallengeNameDesContainer.appendChild(ChallengeIntroTitle);
            ChallengeNameDesContainer.appendChild(ChallengeIntroDescription);

            ChallengeIntroContainer.appendChild(ChallengeIntroNo);
            ChallengeIntroContainer.appendChild(ChallengeNameDesContainer);

            //Add to Challenge Intro Grid Layout
            ChallengeIntro.appendChild(ChallengeIntroContainer);

            
            //Challenge Content
            
            var ChallengeContainerTitle  = document.createElement("h1");
            ChallengeContainerTitle.textContent= challengesArray[i].challenge_name;            

            var ChallengeContainerHeader = document.createElement("h2");
            ChallengeContainerHeader.textContent= "Overcoming " + challengesArray[i].challenge_name;

            var ChallengeContainerContent  = document.createElement("p");
            ChallengeContainerContent.textContent= challengesArray[i].challenge_content;
            
            var ChallengeContentContainer = document.createElement("div");
            ChallengeContentContainer.id = "ChallengeContentContainer";
            ChallengeContentContainer.classList.add("hidden");
            ChallengeContentContainer.appendChild(ChallengeContainerTitle);
            ChallengeContentContainer.appendChild(ChallengeContainerHeader);
            ChallengeContentContainer.appendChild(ChallengeContainerContent);
            //Add to Challenge Intro Grid Layout
            ChallengeContainer.appendChild(ChallengeContentContainer);
          }
        }
        const PageTitle = document.getElementById("PageTitle");
        PageTitle.textContent = result.industry.industry_name;
        // Serialize the modified document back to a string
        const modifiedContent = dom.serialize();

        // Send the modified content as the response
        res.status(200).send(modifiedContent);
    });
   
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving Industry_Info");
    }
};

const createNewChallenge = async (req, res) => {
  const newChallenge = req.body;
  try {
      const role = await validateRole.validateUserRole(req);
      if (role === "admin") {
          const data = await Industry_Challenges.createNewChallenge(newChallenge);
          if (!data) {
              return res.status(404).send("Challenge not found");
          }
          res.status(200).json(data);
      } else if (role === "user") {
          return res.status(401).json({ message: "Access error", details: "You are not an Admin. Lack of access." });
      } else {
        return res.status(401).json({ message: "Access error", details: role });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating Challenge", error: error.message });
  }
};

const updateChallenge = async (req, res) => {
    const newChallenge = req.body;
    console.log(newChallenge);
    try {
      const role = await validateRole.validateUserRole(req);
      if (role === "admin") {
        const data = await Industry_Challenges.updateChallenge(newChallenge);
        if (!data) {
          return res.status(404).send("Challenge not found");
        }
        res.status(200).json(data);
      } else if (role === "user") {
        return res.status(401).json({ message: "Access error", details: "You are not an Admin. Lack of access." });
      } else {
        return res.status(401).json({ message: "Access error", details: role });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating Challenge");
    }
};

const updateIndustryInfo = async (req, res) => {
    const industry_id = req.body.id;
    const newIndustryIntro = req.body.introduction;
    try {
      const role = await validateRole.validateUserRole(req);
      if (role === "admin") {
        const data = await Industry_Info.updateIndustryInfo(industry_id, newIndustryIntro);
        if (!data) {
          return res.status(404).send("Industry not found");
        }
        res.status(200).json(data);
      } else if (role === "user") {
        return res.status(401).json({ message: "Access error", details: "You are not an Admin. Lack of access." });
      } else {
        return res.status(401).json({ message: "Access error", details: role });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error Updating Industry");
    }
};

const deleteIndustryChallenge = async (req, res) => {
    const industry_id = parseInt(req.params.id);
    try {
      const role = await validateRole.validateUserRole(req);
      if (role === "admin") {
        const data = await Industry_Challenges.deleteIndustryChallenge(industry_id);
        if (!data) {
          return res.status(404).send("Challenge not found");
        }
      res.status(200).json(data);
      } else if (role === "user") {
        return res.status(401).json({ message: "Access error", details: "You are not an Admin. Lack of access." });
      } else {
        return res.status(401).json({ message: "Access error", details: role });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting Challenge");
    }
};

const displayAdminPage = async (req,res) =>{
  const filePath = path.join(__dirname, "../public", "html", "industryAdmin.html");
  console.log("File path is" + filePath);
  // Read the index.html file
  fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
          console.error("Error reading industryAdmin.html file:", err);
          res.status(500).send("Internal Server Error");
          return;
      }

      // Create a new JSDOM instance
      const dom = new JSDOM(data);

      // Access the document object
      const document = dom.window.document;

    

      // Serialize the modified document back to a string
      const modifiedContent = dom.serialize();

      // Send the modified content as the response
      res.status(200).send(modifiedContent);
  });
}


module.exports = {
  getAllIndustryInfo,
  getIndustryInfo,
  deleteIndustryChallenge,
  createNewChallenge,
  updateChallenge,
  updateIndustryInfo,
  displayAdminPage
};
