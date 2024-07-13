// Mock data for viewing a completed form
const feedbackData = {
    id: 1, // Example feedback ID
    type: 'Bugs',
    name: 'John Doe',
    email: 'john.doe@example.com',
    number: '1234567890',
    comments: 'There is a bug in the application.'
};

// Populate the form with feedback data
document.getElementById('type').value = feedbackData.type;
document.getElementById('name').value = feedbackData.name;
document.getElementById('email').value = feedbackData.email;
document.getElementById('number').value = feedbackData.number;
document.getElementById('comments').value = feedbackData.comments;

document.getElementById('resolve-button').addEventListener('click', async function() {
    try {
        const response = await fetch(`/users/feedback/${feedbackData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ resolve: 'Y' })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
        alert('Feedback marked as resolved!');
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error resolving the feedback.');
    }
});