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




document.addEventListener("DOMContentLoaded", () => {
    // Get the main_intro container
    const mainIntro = document.getElementById("main_intro");

    // Get the current URL
    const currentUrl = window.location.href;

    // Use a regular expression to extract the number from the URL
    const industryIdMatch = currentUrl.match(/\/industry\/(\d+)/);
    if (industryIdMatch && industryIdMatch[1]) {
        const industryId = industryIdMatch[1];
        mainIntro.style.backgroundImage = `url(../../images/industry${industryId}.jpg)`;
    }
});
