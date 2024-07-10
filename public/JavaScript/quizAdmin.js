const getData = async () => {
  try {
    const response = await fetch('/admin/api/quiz');
    return await handleResponse(response, null);
  } catch (error) {
    console.error('Error fetching data:', error);
    showToast("Error retrieving data");
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

// Buttons
// Correct Answer Option
const option_1_btn = document.getElementById("Option1");
const option_2_btn = document.getElementById("Option2");
const option_3_btn = document.getElementById("Option3");
const option_4_btn = document.getElementById("Option4");

const add_button = document.getElementById("button_add_question");
const delete_button = document.getElementById("button_delete_question");
const save_question_button = document.getElementById("button_save_question");

//Current User
const user_id = localStorage.getItem("user_id");
const admin_id = localStorage.getItem("admin_id");
const username = localStorage.getItem("username");

// Load data when page is loaded
document.addEventListener("DOMContentLoaded", async function() {
  await populateSelectors(); // Initial population
});

// Event listener to fetch data and populate selectors
const populateSelectors = async () => {
  const result = await getData(); // Use getData function
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

    // Populate Question Selector
    const PopulateQuestionSelector = (id) => {
      removeAllChildren(question_selector);

      // Clear Question Data
      question_text.textContent = "";
      question_text.value = null;
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

    // Set Industry Intro
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

      question_text.textContent = "";
      question_text.value = null;
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
    showToast("Failed to load Question data");
  }
};

// Save changes in question
save_question_button.addEventListener("click", async () => {
  const selectedOption = question_selector.options[question_selector.selectedIndex];
  const selectedQuestionId = parseInt(selectedOption.getAttribute('data-question-id'), 10);

  if (!selectedQuestionId) {
    console.log("Select a question");
    showToast("Select a question");
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
    showToast("Enter values for all fields");
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
    showToast("Select the correct option");
    return;
  }
  console.log(selectedQuestionId);
  console.log(newQuestionText);
  console.log(newOption1);
  console.log(newOption2);
  console.log(newOption3);
  console.log(newOption4);
  console.log("correctOptionId before putting: "+correctOptionId);
  
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
        correct_option_id: correctOptionId,
        user_id:user_id,
        admin_id:admin_id
      })
    });

    const data = await handleResponse(response, "Successfully Updated Question");
    console.log(data);

    // Update selectors
    await populateSelectors();
  } catch (error) {
    console.error('Error updating question:', error);
    showToast("Error updating question details.");
  }
});

// Add Question to Database
add_button.addEventListener("click", async () => {
  const selectedIndustryId = industry_selector.value;
  if (!selectedIndustryId) {
    console.log("Select an industry");
    showToast("Select an industry");
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
    showToast("Enter values for all fields");
    return;
  }

  // Determine which option button is checked
  let correctOptionId;
  if (option_1_btn.checked) {
    correctOptionId = 1;
  } else if (option_2_btn.checked) {
    correctOptionId = 2;
  } else if (option_3_btn.checked) {
    correctOptionId = 3;
  } else if (option_4_btn.checked) {
    correctOptionId = 4;
  } else {
    console.log("Select the correct option");
    showToast("Select the correct option");
    return;
  }

  console.log("coreect option id: " + correctOptionId)
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
        correct_option_id: correctOptionId,
        user_id:user_id,
        admin_id:admin_id
      })
    });

    const data = await handleResponse(response, "Successfully Created Question");
    console.log(data);
    // Update selectors
    await populateSelectors();

  } catch (error) {
    console.error('Error creating question:', error);
    showToast("Error creating question");
  }
});

// Delete Question
delete_button.addEventListener("click", async () => {
  const selectedOption = question_selector.options[question_selector.selectedIndex];
  const selectedQuestionId = parseInt(selectedOption.getAttribute('data-question-id'), 10);

  if (!selectedQuestionId) {
    console.log("Select a question");
    showToast("Select a question");
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
        question_id: selectedQuestionId,
        user_id:user_id,
        admin_id:admin_id
      })
    });

    const data = await handleResponse(response, "Successfully Deleted Question");
    console.log(data);

    // Update selectors
    await populateSelectors();
  } catch (error) {
    console.error('Error deleting question:', error);
    showToast("Error deleting question");
  }
});

// Handles bad and good requests
async function handleResponse(response, successfulMsg) {
  if (response.ok) {
    if (successfulMsg){
      showToast(successfulMsg);
    }
    
    return await response.json();
  } else if (response.status === 400) {
    const errorData = await response.json();
    console.error("Validation error:", errorData.errors);
    showToast("Validation error: " + errorData.errors.join(", "));
    throw new Error("Validation error");
  } else if (response.status === 401) {
    const errorData = await response.json();
    console.error("Access error:", errorData.details);
    showToast("Access error: " + errorData.details);
    throw new Error("Access error");
  }else if (response.status === 402) {
    const errorData = await response.json();    
    console.error("Access error:", errorData.details);
    showToast("Access error: " + errorData.details);
    throw new Error("Access error");
  } else {
    console.error("Unexpected response status:", response.status);
    showToast("Unexpected error occurred. Please try again.");
    throw new Error("Unexpected error");
  }
}

// Remove all child elements
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Shows toast when called
function showToast(message) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Show the toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    // Remove the toast from the DOM after it fades out
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 500);
  }, 3000);
}
