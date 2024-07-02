document.getElementById('feedback-form').addEventListener('submit', async function() {
    alert('Feedback submitted successfully!');
     // Gather form data
    const formData = {
        type: document.getElementById('type').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        number: document.getElementById('number').value,
        comment: document.getElementById('comments').value
    };

    // Send form data to API endpoint
    fetch('/users/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Feedback submitted successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting your feedback.');
    });
    

    /* try {
        const response = await fetch('/users/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);

    } catch (error) {
        console.error('Error:', error);
    } */

});