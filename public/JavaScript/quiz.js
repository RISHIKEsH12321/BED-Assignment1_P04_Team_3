const submitBtn = document.getElementById("submit_quiz");

submitBtn.addEventListener("click", async () => {
    let data = [];
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        const questionID = question.dataset.questionId;
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        if (selectedOption) {
            const selectedOptionID = selectedOption.value;
            data.push({ "question_id": parseInt(questionID), "option_id": parseInt(selectedOptionID) });
        }
    });
    
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
    } catch (err) {
        console.log("Error checking answers", err);
        throw err;
    }
});
