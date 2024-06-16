const submitBtn = document.getElementById("submit_quiz");
const redoBtn = document.getElementById("redo_quiz");
const exitBtn = document.getElementById("exit");
const heading = document.getElementById("QuizPageHeading");


submitBtn.addEventListener("click", async () => {
    let data = [];
    const questions = document.querySelectorAll('.question');
    let allQuestionsAnswered = true; // Flag to track if all questions have been answered
    questions.forEach(question => {
        const questionID = question.dataset.questionId;
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        if (selectedOption) {
            const selectedOptionID = selectedOption.value;
            data.push({ "question_id": parseInt(questionID), "option_id": parseInt(selectedOptionID) });
        } else {
            console.log(`Question ${questionID} is not answered.`);
            allQuestionsAnswered = false; // Set flag to false if any question is not answered
        }
    });

    // Check if all questions have been answered before proceeding
    if (!allQuestionsAnswered) {
        console.log('Please answer all questions before submitting.');
        showToast('Please answer all questions before submitting.');

        return;
    }
    
    try {
        const formattedData = data.map(({ question_id, option_id }) => `question_id=${question_id}&option_id=${option_id}`).join('&');
        console.log(formattedData)
        const response = await fetch(`/user/quiz/checkAnswers?${formattedData}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const responseData = await response.json();
        console.log(responseData);
        updateChart(responseData);
    } catch (err) {
        console.log("Error checking answers", err);
        throw err;
    }
});



function updateChart(fractionInput) {

    const container = document.getElementById("resultsContainer");
    const circle = document.getElementById("circle");
    const percentage = document.getElementById("percentage");
    
    let fraction = parseFloat(fractionInput/15);
    
    
    const percentageValue = (fraction * 100).toFixed(2) + '%';
    percentage.textContent = percentageValue;
    const degree = fraction * 360;
    
    circle.style.background = `conic-gradient(#007bff ${degree}deg, #eee ${degree}deg)`;
    container.style.display = "flex";
}

redoBtn.addEventListener("click", () => {
    location.reload();
});

exitBtn.addEventListener("click", () => {
    window.location.href = "/home";
});


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
