const getData = async () => {
    try {
      const response = await fetch('/admin/api/quiz');
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

// Form Elements
// Selectors
const industry_selector = document.getElementById("IndustrySelection");
const question_selector = document.getElementById("Questions");

// Text Areas
const question_text = document.getElementById("QuestionText");
const option_1 = document.getElementById("Question_Option1");
const option_2 = document.getElementById("Question_Option2");
const option_3 = document.getElementById("Question_Option3");
const option_4 = document.getElementById("Question_Option4");

//Buttons
//Correct Answer Option
const option_1_btn = document.getElementById("Option1");
const option_2_btn = document.getElementById("Option2");
const option_3_btn = document.getElementById("Option3");
const option_4_btn = document.getElementById("Option4");

const add_button = document.getElementById("button_add_question");
const delete_button = document.getElementById("button_delete_question");
const save_question_button = document.getElementById("button_save_question");

//Load data whn page is loaded
document.addEventListener("DOMContentLoaded", async function() {

    await populateSelectors(); // Initial population
});

// Event listener to fetch data and populate selectors
const populateSelectors = async () => {
    const result = await getData(); // Use getData function
    console.log(result)
    if (result) {
      // Store currently selected values
      const selectedIndustryId = industry_selector.value;
    
      // Clear existing Selectors Options
      removeAllChildren(industry_selector);
  
      // Populate Industry Selector
      const industry_option = document.createElement("option");
      industry_option.textContent = "Select Industry";
      industry_option.value = "";
      industry_selector.appendChild(industry_option);
  
      for (let i = 0; i < result.length; i++) {
        const industry_option = document.createElement("option");
        industry_option.textContent = result[i].industry_name;
        industry_option.value = result[i].industry_id;
        industry_selector.appendChild(industry_option);
      }
      // Set the selected industry back
      industry_selector.value = selectedIndustryId;


      //Populate Quesion Selector
      const PopulateQuestionSelector = (id)=>{
        removeAllChildren(question_selector);

        //Clear Question Data
        QuestionText.textContent = "";
        QuestionText.value = null;
        option_1.textContent = "";
        option_1.value = null;
        option_2.textContent = "";
        option_2.value = null;
        option_3.textContent = "";
        option_3.value = null;
        option_4.textContent = "";
        option_4.value = null;

        option_1_btn.checked = false;
        option_2_btn.checked = false;
        option_3_btn.checked = false;
        option_4_btn.checked = false;
  

        // Populate Question Selector
        const question_option = document.createElement("option");
        question_option.textContent = "Select Question";
        question_option.value = "";
  
        const question_option_add = document.createElement("option");
        question_option_add.textContent = "Add New Question";
        question_option_add.value = "add";
  
        question_selector.appendChild(question_option);
        question_selector.appendChild(question_option_add);
  
        for (let i = 0; i < result.length; i++) {

          if (result[i].industry_id === id) {
            result[i].questions.forEach(question => {
                const question_selector_option = document.createElement("option");
                question_selector_option.textContent = question.question_text;
                question_selector_option.setAttribute('data-question-id', question.question_id);
                question_selector.appendChild(question_selector_option);
            });
          }
        }
      };
      question_selector.value = selectedIndustryId;
  
      // Clear Option Data
      option_1.textContent = "";
      option_2.textContent = "";
      option_3.textContent = "";
      option_4.textContent = "";

  
      //Set Industry Intro
      const id = parseInt(industry_selector.value, 10);
  
      PopulateQuestionSelector(id);
  
      
  
      // Event listener for industry selector
      industry_selector.addEventListener("change", () => {
        removeAllChildren(question_selector);
  
        const id = parseInt(industry_selector.value, 10);

        PopulateQuestionSelector(id);
      });
  
      
  
  
      // Event listener for Challenge selector
      question_selector.addEventListener("change", () => {
        const selectedOption = question_selector.options[question_selector.selectedIndex];
        const questionId = parseInt(selectedOption.getAttribute('data-question-id'), 10);
        const industryId = parseInt(industry_selector.value, 10);

        // Find the selected question
        const industry = result.find(ind => ind.industry_id === industryId);
        if (industry) {
            const question = industry.questions.find(q => q.question_id === questionId);
            if (question) {
                // Populate the question and options fields
                question_text.value = question.question_text;
                option_1.value = question.options[0] ? question.options[0].option_text : "";
                option_2.value = question.options[1] ? question.options[1].option_text : "";
                option_3.value = question.options[2] ? question.options[2].option_text : "";
                option_4.value = question.options[3] ? question.options[3].option_text : "";

                // Set the value of each radio button to the corresponding option_id
                if (question.options[0]) option_1_btn.value = question.options[0].option_id;
                if (question.options[1]) option_2_btn.value = question.options[1].option_id;
                if (question.options[2]) option_3_btn.value = question.options[2].option_id;
                if (question.options[3]) option_4_btn.value = question.options[3].option_id;

                // Set the correct option radio button
                option_1_btn.checked = Number(question.correct_option_id) === Number(option_1_btn.value);
                option_2_btn.checked = Number(question.correct_option_id) === Number(option_2_btn.value);
                option_3_btn.checked = Number(question.correct_option_id) === Number(option_3_btn.value);
                option_4_btn.checked = Number(question.correct_option_id) === Number(option_4_btn.value);


            }
        }
    });

    } else {
      console.error('Failed to load Question data.');
    }
};


//Save changes in question
save_question_button.addEventListener("click", async () => {
    const selectedOption = question_selector.options[question_selector.selectedIndex];
    const selectedQuestionId = parseInt(selectedOption.getAttribute('data-question-id'), 10);
  
    if (!selectedQuestionId) {
      console.log("Select a question");
      return;
    }
  
    const newQuestionText = question_text.value;
    const newOption1 = option_1.value;
    const newOption2 = option_2.value;
    const newOption3 = option_3.value;
    const newOption4 = option_4.value;

  
    // Check if all fields are filled
    if (!newQuestionText || !newOption1 || !newOption2 || !newOption3 || !newOption4) {
      console.log("Enter values for all fields");
      return;
    }
    // Determine which option button is checked
    let correctOptionId;
    if (option_1_btn.checked) {
        correctOptionId = option_1_btn.value;
    } else if (option_2_btn.checked) {
        correctOptionId = option_2_btn.value;
    } else if (option_3_btn.checked) {
        correctOptionId = option_3_btn.value;
    } else if (option_4_btn.checked) {
        correctOptionId = option_4_btn.value;
    } else {
        console.log("Select the correct option");
        return;
    }
    console.log(selectedQuestionId);
    console.log(newQuestionText);
    console.log(newOption1);
    console.log(newOption2);
    console.log(newOption3);
    console.log(newOption4);
    console.log(correctOptionId);
    
    try {
      // Send PUT request to update question
      const response = await fetch('/admin/quiz/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_id: selectedQuestionId,
          question_text: newQuestionText,
          options: [
            { option_id: option_1_btn.value, option_text: newOption1 },
            { option_id: option_2_btn.value, option_text: newOption2 },
            { option_id: option_3_btn.value, option_text: newOption3 },
            { option_id: option_4_btn.value, option_text: newOption4 }
          ],
          correct_option_id: correctOptionId
        })
      });
      
  
      const data = await response.json();
      console.log(data);
  
      // Update selectors
      await populateSelectors();
    } catch (error) {
      console.error('Error updating question:', error);
    }
});

//Add Question to Database
add_button.addEventListener("click", async () => {
    const selectedIndustryId = industry_selector.value;
    if (!selectedIndustryId) {
        console.log("Select an industry");
        return;
    }

    const newQuestionText = question_text.value;
    const newOption1 = option_1.value;
    const newOption2 = option_2.value;
    const newOption3 = option_3.value;
    const newOption4 = option_4.value;

    // Check if all fields are filled
    if (!newQuestionText || !newOption1 || !newOption2 || !newOption3 || !newOption4) {
        console.log("Enter values for all fields");
        return;
    }

    // Determine which option button is checked
    let correctOptionId;
    if (option_1_btn.checked) {
        correctOptionId = option_1_btn.value;
    } else if (option_2_btn.checked) {
        correctOptionId = option_2_btn.value;
    } else if (option_3_btn.checked) {
        correctOptionId = option_3_btn.value;
    } else if (option_4_btn.checked) {
        correctOptionId = option_4_btn.value;
    } else {
        console.log("Select the correct option");
        return;
    }

    try {
        // Send POST request to create a new question
        const response = await fetch('/admin/quiz/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                industry_id: selectedIndustryId,
                question_text: newQuestionText,
                options: [
                    { option_text: newOption1 },
                    { option_text: newOption2 },
                    { option_text: newOption3 },
                    { option_text: newOption4 }
                ],
                correct_option_id: 3
            })
        });

        const data = await response.json();
        console.log(data);

        // Update selectors
        await populateSelectors();
    } catch (error) {
        console.error('Error creating question:', error);
    }
});

//Delete Question
delete_button.addEventListener("click", async () => {
    const selectedOption = question_selector.options[question_selector.selectedIndex];
    const selectedQuestionId = parseInt(selectedOption.getAttribute('data-question-id'), 10);

    if (!selectedQuestionId) {
        console.log("Select a question");
        return;
    }

    try {
        // Send DELETE request to delete the question
        const response = await fetch('/admin/quiz/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question_id: selectedQuestionId
            })
        });

        const data = await response.json();
        console.log(data);

        // Update selectors
        await populateSelectors();
    } catch (error) {
        console.error('Error deleting question:', error);
    }
});










// Remove all child elements
function removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
}