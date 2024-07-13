document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.toggle-button');
    const sections = document.querySelectorAll('.content-section');
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
  
        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
  
        // Show the targeted section
        const targetSection = document.getElementById(button.dataset.target);
        targetSection.classList.add('active');
      });
    });
  
    // Show the first section by default
    if (buttons.length > 0) {
        buttons[0].classList.add('active');
        sections[0].classList.add('active');
    }
});
  