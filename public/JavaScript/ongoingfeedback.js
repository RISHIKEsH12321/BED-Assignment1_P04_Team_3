

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
        //checking if feedback is favourited 
        if(feedback.favourite == "Y"){
            starspan.classList.add("star", "gold");
        } else {
            starspan.classList.add("star", "gray");
        }
        star.appendChild(starspan);

        const id = document.createElement("td");
        id.textContent = feedback.id;
        
        const date = document.createElement("td");
        date.textContent = feedback.date_created;

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


// changing the star between gray and gold when clicked
document.addEventListener('DOMContentLoaded', (event) => {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            if (star.classList.contains('gray')) {
                star.classList.remove('gray');
                star.classList.add('gold');
            } else {
                star.classList.remove('gold');
                star.classList.add('gray');
            }
        });
    });
});