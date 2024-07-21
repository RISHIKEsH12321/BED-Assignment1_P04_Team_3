const Quiz_Question = require("../models/quiz_question");
const validateRole = require("../middleware/validateRole");

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom"); 

const get15Questions = async (req,res) =>{
    const industry_id = parseInt(req.params.id);
    try {
        let result = await Quiz_Question.get15Questions(industry_id);
        // console.log(result)
        // console.log(Array.isArray(result.questions))
        // console.log(result.questions.length === 0)
        // console.log(result.industryName)      
        if (!Array.isArray(result.questions) || result.questions.length === 0 || !result.industryName) {
          return res.status(404).send("Questions for industry not found");
        }
      
        const name = result.industryName;
        //Get 15 random quesion
        if (result.questions.length > 15) {
          result = getRandomSubset(result.questions, 15);
        }else{
          result = result.questions;
        }
        
        const filePath = path.join(__dirname, "../public", "html", "quiz.html");
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

            //Question Container
            const container = document.getElementById("question_container");

            //Header
            const header = document.getElementById("QuizPageHeading");
            header.textContent = `${name} Quiz`;

            // //Populate Quiz Container
            for(var i = 0; i<result.length; i++){
              // console.log(result.length)
              // console.log(result[i])
              container.appendChild(createQuestionElement(document, result[i],i));
            }


            // Serialize the modified document back to a string
            const modifiedContent = dom.serialize();

            // Send the modified content as the response
            return res.status(200).send(modifiedContent);
        })

    }catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving Questions");
    }
}

const getAllQuestions = async (req,res) =>{
  try{
    const data =  await Quiz_Question.getAllQuestions();
    if (!data) {
      return res.status(404).send("Questions for industry not found");
    }
    res.status(200).send(data);
  }catch (err){
    res.status(500).send("Error Getting questions");
  }
}

const displayAdminPage = async (req,res) =>{
  const filePath = path.join(__dirname, "../public", "html", "quizAdmin.html");
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

const checkAnswers = async (req,res) =>{
  try{
    const questionData = req.query;
    const formattedData = questionData.question_id.map((question_id, index) => ({
      question_id: parseInt(question_id),
      option_id: parseInt(questionData.option_id[index])
    }));
    const result = await Quiz_Question.checkAnswer(formattedData);
    console.log(result)
    if (result >= 0){
      res.status(200).json(result);
    }else{
      return res.status(404).send("Questions not found");
    }

    

  }catch (err){
    console.log("Error getting results", err);
    res.status(500).send("Error Getting Results");
  }

}

const updateQuestion = async (req,res) =>{
  const newQuesion = req.body;
  console.log(newQuesion)
  try {
    const role = await validateRole.validateUserRole(req);
    if (role === "admin") {
      const data = await Quiz_Question.updateQuestion(newQuesion);
      if (!data) {
        return res.status(404).send("Question not found");
      }
      res.status(200).json(data);
    } else {
      return res.status(401).json({ message: "Access error", details: "You are not an Admin. Lack of access." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Updating Question");
  }
}

const createNewQuestion = async (req,res) =>{
  const newQuesion = req.body;
  try {
    const role = await validateRole.validateUserRole(req);
    if (role === "admin") {
      const data = await Quiz_Question.createNewQuestion(newQuesion);
      if (!data) {
        return res.status(404).send("Question not found");
      }
      res.status(200).json(data);
    } else {
      return res.status(401).json({ message: "Access error", details: "You are not an Admin. Lack of access." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Creating Question");
  }
}

const deleteQuestion = async (req,res) =>{
  const question_id = req.body.question_id;
  try {
    const role = await validateRole.validateUserRole(req);
    if (role === "admin") {
      const data = await Quiz_Question.deleteQuestion(question_id);
      if (!data) {
        return res.status(404).send("Question not found");
      }
    res.status(200).json(data);
    } else {
      return res.status(401).json({ message: "Access error", details: "You are not an Admin. Lack of access." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Deleting Question");
  }
  
}

function createQuestionElement(document, question, index) {
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question");
  questionDiv.dataset.questionId = question.question_id;
  
  const questionText = document.createElement("p");
  questionText.textContent = `Q${index + 1}: ${question.question_text}`; 
  questionDiv.appendChild(questionText);
  
  question.options.forEach(option => {
    const optionLabel = document.createElement("label");
    const optionInput = document.createElement("input");
    optionInput.type = "radio";
    optionInput.name = `${question.question_id}`;
    optionInput.value = option.option_id;
    optionLabel.appendChild(optionInput);
    optionLabel.appendChild(document.createTextNode(option.option_text));
    questionDiv.appendChild(optionLabel);
  });
  
  return questionDiv;
}

function getRandomSubset(array, n) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}


module.exports={
    get15Questions,
    updateQuestion,
    createNewQuestion,
    deleteQuestion,
    checkAnswers,
    displayAdminPage,
    getAllQuestions
}