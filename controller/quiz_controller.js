const Quiz_Question = require("../models/quiz_question");

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom"); 

const get15Questions = async (req,res) =>{
    const industry_id = parseInt(req.params.id);
    try {
        const data = await Quiz_Question.get15Questions(industry_id);

        if (!data) {
          return res.status(404).send("Questions for industry not found");
        }
        
        // Transform the data into the desired format
        const questionsMap = new Map();

        data.forEach(row => {
            if (!questionsMap.has(row.question_id)) {
                questionsMap.set(row.question_id, {
                    question_id: row.question_id,
                    question_text: row.question_text,
                    options: [],
                    correct_option_id: row.correct_option_id ? row.correct_option_id : null
                });
            }

            const question = questionsMap.get(row.question_id);
            question.options.push({
                option_id: row.option_id,
                option_text: row.option_text
            });

            // Update correct_option_id if it is null and current row has correct_option_id
            if (question.correct_option_id === null && row.correct_option_id !== null) {
                question.correct_option_id = row.correct_option_id;
            }
        });
        //Final Array with all questions
        const result = Array.from(questionsMap.values());
        
        // res.send(result.industry.industry_name);
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
            function createQuestionElement(question) {
              const questionDiv = document.createElement("div");
              questionDiv.classList.add("question");
              
              const questionText = document.createElement("p");
              questionText.textContent = question.question_text;
              questionDiv.appendChild(questionText);
              
              question.options.forEach(option => {
                const optionLabel = document.createElement("label");
                const optionInput = document.createElement("input");
                optionInput.type = "radio";
                optionInput.name = `question_${question.question_id}`;
                optionInput.value = option.option_id;
                optionInput.dataset.correct = (option.option_id === question.correct_option_id).toString();
                optionLabel.appendChild(optionInput);
                optionLabel.appendChild(document.createTextNode(option.option_text));
                questionDiv.appendChild(optionLabel);
              });
              
              return questionDiv;
          }
            result.forEach(question => {
              container.appendChild(createQuestionElement(question));
            });


            // Serialize the modified document back to a string
            const modifiedContent = dom.serialize();

            // Send the modified content as the response
            res.status(200).send(modifiedContent);
        })

    }catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving Questions");
    }
}

const updateQuestion = async (req,res) =>{
    const newQuesion = req.body;
    try {
      const data = await Quiz_Question.updateQuestion(newQuesion);
      if (!data) {
        return res.status(404).send("Question not found");
      }
    res.status(200).json(data);

    } catch (error) {
      console.error(error);
      res.status(500).send("Error Updating Question");
    }
}

const createNewQuestion = async (req,res) =>{
    const newQuesion = req.body;
    try {
      const data = await Quiz_Question.createNewQuestion(newQuesion);
      if (!data) {
        return res.status(404).send("Question not found");
      }
    res.status(200).json(data);

    } catch (error) {
      console.error(error);
      res.status(500).send("Error Creating Question");
    }

}

const deleteQuestion = async (req,res) =>{
    const question_id = req.body.question_id;
    try {
        const data = await Quiz_Question.deleteQuestion(question_id);
        if (!data) {
          return res.status(404).send("Question not found");
        }
      res.status(200).json(data);
  
      } catch (error) {
        console.error(error);
        res.status(500).send("Error Deleting Question");
      }
  
}


module.exports={
    get15Questions,
    updateQuestion,
    createNewQuestion,
    deleteQuestion

}