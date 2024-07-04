const quizBtn = document.getElementById("QuizButton");

// Get the current URL
const currentUrl = window.location.href;

// Use a regular expression to extract the number from the URL
const industryIdMatch = currentUrl.match(/\/industry\/(\d+)/);

if (industryIdMatch && industryIdMatch[1]) {
    const industryId = industryIdMatch[1];

    // Set the button's href attribute
    quizBtn.addEventListener("click", function() {
        window.location.href = `/users/quiz/${industryId}`;
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

    const challengeContainers = document.querySelectorAll("#ChallengeIntro > div");

    challengeContainers.forEach((container, index) => {
        container.addEventListener("click", () => {
            scrollToChallenge(index + 1); // Index starts from 0, so add 1 for challenge numbers starting from 1
        });
    });

    function scrollToChallenge(challengeNumber) {
        const challengeSection = document.querySelector(`#ChallengeContainer > div:nth-of-type(${challengeNumber})`);
        if (challengeSection) {
            challengeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});
