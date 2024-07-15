// Function to get the feedback ID from the URL path
function getFeedbackIdFromUrl() {
    const path = window.location.pathname;
    const segments = path.split('/');
    return segments[segments.length - 1]; // Return the last segment, which should be the feedback ID
}

// Get feedback ID from URL path
const feedbackId = getFeedbackIdFromUrl();

// Fetch feedback details using the feedback ID
async function fetchFeedbackDetails(id) {
    try {
        const response = await fetch(`/admin/feedback/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const feedback = await response.json();
        document.getElementById('type').value = feedback.type;
        document.getElementById('name').value = feedback.name;
        document.getElementById('email').value = feedback.email;
        document.getElementById('number').value = feedback.number;
        document.getElementById('comments').value = feedback.comment;
    } catch (error) {
        console.error('Error fetching feedback details:', error);
    }
}

// Fetch feedback details on page load
if (feedbackId) {
    fetchFeedbackDetails(feedbackId);
}


//updating resolve of feedback to Y
document.getElementById('resolve-button').addEventListener('click', async function() {
    try {
        const response = await fetch(`/admin/resolve/${feedbackId}`, {
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


