const getData = async () => {
  try {
    const response = await fetch('/admin/api/industry');
    const result = await handleResponse(response, null);

    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    showToast("Error Retrieving Data")
  }
};

// Form Elements

// Selectors
const industry_selector = document.getElementById("IndustrySelection");
const challenge_selector = document.getElementById("IndustryChallanges");

// Text Areas
const intro_edit = document.getElementById("IndustryIntro");
const challenge_name = document.getElementById("ChallangeName");
const challenge_des = document.getElementById("ChallangeDes");
const challenge_content = document.getElementById("ChallangeContent");

// Buttons
const save_button = document.getElementById("button_save_intro");
const add_button = document.getElementById("button_add_challenge");
const delete_button = document.getElementById("button_delete_challenge");
const save_challenge_button = document.getElementById("button_save_challenge");

//Current User
const user_id = localStorage.getItem("user_id");
const admin_id = localStorage.getItem("admin_id");
const username = localStorage.getItem("username");

document.addEventListener("DOMContentLoaded", async function() {

  await populateSelectors(); // Initial population
});

// Event listener to fetch data and populate selectors
const populateSelectors = async () => {
  const result = await getData(); // Use getData function

  if (result) {
    // Store currently selected values
    const selectedIndustryId = industry_selector.value;
    const selectedChallengeId = challenge_selector.value;


    // Clear existing Selectors Options
    removeAllChildren(industry_selector);

    // Populate Industry Selector
    const industry_option = document.createElement("option");
    industry_option.textContent = "Select Industry";
    industry_option.value = "";
    industry_selector.appendChild(industry_option);

    for (let i = 0; i < result.industry.length; i++) {
      const industry_option = document.createElement("option");
      industry_option.textContent = result.industry[i].industry_name;
      industry_option.value = result.industry[i].industry_id;
      industry_selector.appendChild(industry_option);
    }
    // Set the selected industry back
    industry_selector.value = selectedIndustryId;

    //Populate Challange Selector
    const PopulateChallangeSelector = (id)=>{
      removeAllChildren(challenge_selector);

      //Clear Current Intro and Challange Data
      challenge_name.textContent = "";
      challenge_name.value = null;
      challenge_des.textContent = "";
      challenge_des.value = null;
      challenge_content.textContent = "";
      challenge_content.value = null;


      // Populate Challenge Selector
      const challenge_option = document.createElement("option");
      challenge_option.textContent = "Select Challange";
      challenge_option.value = "";

      const challenge_option_add = document.createElement("option");
      challenge_option_add.textContent = "Add New Challenge";
      challenge_option_add.value = "add";

      challenge_selector.appendChild(challenge_option);
      challenge_selector.appendChild(challenge_option_add);

      for (let i = 0; i < result.challanges[0].length; i++) {
        if (result.challanges[0][i].industry_id === id) {
          const challenge_option = document.createElement("option");
          challenge_option.textContent = result.challanges[0][i].challenge_name;
          challenge_option.setAttribute('data-industry-id', result.challanges[0][i].industry_id);
          challenge_option.setAttribute('data-challenge-id', result.challanges[0][i].challenge_id);
          challenge_selector.appendChild(challenge_option);
        }
      }
    };
    challenge_selector.value = selectedIndustryId;

    // Clear Current Intro and Challenge Data
    // intro_edit.textContent = "";
    challenge_name.textContent = "";
    challenge_des.textContent = "";
    challenge_content.textContent = "";

    //Set Industry Intro
    const id = parseInt(industry_selector.value, 10);
    const selectedIndustry = result.industry.find(industry => industry.industry_id === id);
    if (selectedIndustry) {
      intro_edit.value = selectedIndustry.introduction;
    }

    PopulateChallangeSelector(id);

    // Populate Challenge Selector
    // const populateChallengeSelector = () => {
  
    // };
    // industry_selector.addEventListener("change", populateChallengeSelector);

    // Initial population of challenges based on the default industry selection
    // if (industry_selector.value) {
    //   populateChallengeSelector();
    // }

    // Event listener for industry selector
    industry_selector.addEventListener("change", () => {
      removeAllChildren(challenge_selector);



      const id = parseInt(industry_selector.value, 10);
      const selectedIndustry = result.industry.find(industry => industry.industry_id === id);
      if (selectedIndustry) {
        intro_edit.value = selectedIndustry.introduction;
      }

      PopulateChallangeSelector(id);
    });

    


    // Event listener for Challenge selector
    challenge_selector.addEventListener("change", () => {
      const selectedOption = challenge_selector.options[challenge_selector.selectedIndex];
      const challengeId = selectedOption.dataset.challengeId;

      if (challengeId) {
        // Find the challenge object based on the selected challenge ID
        const selectedChallenge = result.challanges[0].find(
          (challenge) => challenge.challenge_id === parseInt(challengeId)
        );

        if (selectedChallenge) {
          // Set the appropriate text content based on the selected challenge
          challenge_name.value = selectedChallenge.challenge_name;
          challenge_des.value = selectedChallenge.challenge_description;
          challenge_content.value = selectedChallenge.challenge_content;
        } else {
          // Clear the text content if no matching challenge is found
          challenge_name.value = "";
          challenge_des.value = "";
          challenge_content.value = "";
        }
      } else {
        // Clear the text content if Select Challenge is selected
        challenge_name.value = "";
        challenge_des.value = "";
        challenge_content.value = "";
      }
    });
  } else {
    console.error('Failed to load industry data.');
  }
};



// Event listener for save intro button
save_button.addEventListener("click", async () => {
  const selectedIndustryId = industry_selector.value;
  if (!selectedIndustryId) {
    console.log("Select an industry");
    showToast("Select an industry");
    return;
  }
  const newIntroduction = intro_edit.value;

  try {
    // Send PUT request to update industry introduction
    const response = await fetch('/admin/industry/intro', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: selectedIndustryId,
        introduction: newIntroduction,
        user_id:user_id,
        admin_id:admin_id
      })
    });

    const data = await handleResponse(response, "Successfully Updated Introduction");
    console.log(data);

    // Update result variable request
    await populateSelectors();
  } catch (error) {
    console.error('Error updating industry introduction:', error);
    // showToast("  Error updating industry introduction");
  }
});

save_challenge_button.addEventListener("click", async () => {
  const selectedOption = challenge_selector.options[challenge_selector.selectedIndex];
  const selectedChallengeId = selectedOption.dataset.challengeId;

  if (!selectedChallengeId) {
    console.log("Select a challenge");
    showToast("Select a challenge");
    return;
  }
  const newName = challenge_name.value;
  const newDes = challenge_des.value;
  const newContent = challenge_content.value;
  if (newName === "" || newDes === "" || newContent === "") {
    console.log("Enter values for all fields");
    showToast("Enter values for all fields");
    return;
  }
  console.log(newName + "\n" + newDes + "\n" + newContent);

  try {
    // Send PUT request to update industry introduction
    const response = await fetch('/admin/industry/challenge', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        challenge_id: selectedChallengeId,
        challenge_name: newName,
        challenge_description: newDes,
        challenge_content: newContent,
        user_id:user_id,
        admin_id:admin_id
      })
    });

    const data = await handleResponse(response, "Successfully Updated Industry Introduction");
    console.log(data);

    // Update result variable request
    await populateSelectors();
  } catch (error) {
    console.error('Error updating industry introduction:', error);
    // showToast('Error updating industry introduction:');
  }
});

add_button.addEventListener("click", async () => {
  const selectedIndustryId = industry_selector.value;
  if (!selectedIndustryId) {
    console.log("Select an industry");
    showToast("Select an industry");
    return;
  }

  const selectedOption = challenge_selector.options[challenge_selector.selectedIndex];
  if (selectedOption.value == "add") {
    const newName = challenge_name.value;
    const newDes = challenge_des.value;
    const newContent = challenge_content.value;

    console.log(`userid: ${user_id}\nadmin_id: ${admin_id}\nusername:  ${username}`);

    if (newName === "" || newDes === "" || newContent === "" || !newName || !newDes || !newContent) {
      console.log("Enter values for all fields");
      showToast("Enter values for all fields");
      return;
    }

    // console.log(newName + "\n" + newDes + "\n" + newContent);
    try {
      // Send PUT request to update industry introduction
      const response = await fetch('/admin/industry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedIndustryId,
          name: newName,
          description: newDes,
          content: newContent,
          user_id:user_id,
          admin_id:admin_id
        })
      });

      const data = await handleResponse(response, "Successfully Adding Industry Challenge");
      console.log(data);

      // Update result variable request
      await populateSelectors();
    } catch (error) {
      console.error('Error adding industry challenge:', error);
      showToast('Error adding industry challenge:');
    }
  } else {
    console.log("Invalid selector option");
    // showToast("Invalid selector option");
  }
});

delete_button.addEventListener("click", async()=>{
  const selectedOption = challenge_selector.options[challenge_selector.selectedIndex];
  const selectedChallengeId = selectedOption.dataset.challengeId;

  if (!selectedChallengeId) {
    console.log("Select a challenge");
    showToast("Select a challenge");
    return;
  }

  try {
    // Send PUT request to update industry introduction
    const response = await fetch('/admin/industry/' + selectedChallengeId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user_id:user_id,
          admin_id:admin_id
      })
    });

    const data = await handleResponse(response,"Sucessfully Deleted Challenge");
    console.log(response.status);

    // Update result variable request
    await populateSelectors();
  } catch (error) {
    console.error('Error deleting industry introduction:', error);
    // showToast('Error deleting industry challenge:');
  }
});


//Handles Bad And Good Requests
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
