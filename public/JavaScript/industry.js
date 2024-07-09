const obserever = new IntersectionObserver((entries) =>{
    entries.forEach((entry) =>{
        if (entry.isIntersecting){
            entry.target.classList.replace("hidden", "show");
        }
    });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => obserever.observe(el));

document.addEventListener("DOMContentLoaded", () => {
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
