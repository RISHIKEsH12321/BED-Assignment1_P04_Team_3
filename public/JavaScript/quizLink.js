const quizBtn = document.getElementById("QuizButton");

// Get the current URL
const currentUrl = window.location.href;

// Use a regular expression to extract the number from the URL
const industryIdMatch = currentUrl.match(/\/industry\/(\d+)/);

if (industryIdMatch && industryIdMatch[1]) {
    const industryId = industryIdMatch[1];

    // Set the button's href attribute
    quizBtn.addEventListener("click", function() {
        window.location.href = `/user/quiz/${industryId}`;
    });
}
