

async function fetchOngoingFeedbacks() {
    const response = await fetch("/admin/ongoingfeedback");
    const data = await response.json();

    const feedbacktable = document.getElementById("feedbacktable");

    data.forEach((feedback) => {
        const row = document.createElement("tr");
        
        //creating elements for star, id date and type of feedback
        const star  = document.createElement("td");
        const starspan = document.createElement("span");
        starspan.innerHTML = '&#9733;';
        starspan.classList.add("star");
        //checking if feedback is favourited 
        if(feedback.favourite == "Y"){
            starspan.classList.add("gold");
        } else {
            starspan.classList.add("gray");
        }
        starspan.dataset.id = feedback.id; // storing feedback id 
        star.appendChild(starspan);

        const id = document.createElement("td");
        id.textContent = feedback.id;
        
        const date = document.createElement("td");
        const dateData = new Date(feedback.date_created);
        const formattedDate = dateData.toLocaleDateString();
        date.textContent = formattedDate;

        const type = document.createElement("td");
        type.textContent = feedback.type;

        const actionCell = document.createElement('td');
        const actionLink = document.createElement('a');
        actionLink.href = `/viewfeedback/${feedback.id}`;
        actionLink.textContent = 'Read';
        actionCell.appendChild(actionLink);

        row.appendChild(star);
        row.appendChild(id);
        row.appendChild(date);
        row.appendChild(type);
        row.appendChild(actionCell);

        feedbacktable.appendChild(row);

    });
}

fetchOngoingFeedbacks(); // calling function

// Add event listener for star toggling and updating
feedbacktable.addEventListener('click', async function(event) {
    if (event.target.classList.contains('star')) {
        const starElement = event.target;
        const feedbackId = starElement.dataset.id;
        const isFavourite = starElement.classList.contains('gold');
        const newFavouriteStatus = isFavourite ? 'N' : 'Y';

        // Update UI
        starElement.classList.toggle('gray');
        starElement.classList.toggle('gold');

        // Send PUT request to update favourite status
        try {
            const response = await fetch(`/admin/fav/${feedbackId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ favourite: newFavouriteStatus })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Update Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
