// document.addEventListener('DOMContentLoaded', () => {
//     const postForm = document.getElementById('postForm');
//     postForm.addEventListener('submit', async (event) => {
//         event.preventDefault(); // Prevent default form submission

//         const formData = new FormData(postForm);
//         const header = formData.get('header');
//         const message = formData.get('message');

//         try {
//             const response = await fetch('/forum', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ header, message })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to create post');
//             }

//             const createdPost = await response.json();
//             console.log('New post created:', createdPost);
//             // Optionally redirect or update UI to show the created post
//         } catch (error) {
//             console.error('Error creating post:', error);
//             // Handle error (e.g., show error message to the user)
//         }
//     });
// });


//Creating a new post
const newPost = document.getElementById("newPost");
const postCreation = document.getElementById("postCreation");
const searchBar = document.getElementById("searchbar");
const post = document.getElementById("post");
const body = document.getElementById("wholePage");
const cancel = document.getElementById("cancel");
newPost.addEventListener("click",function(){
    postCreation.style.display = "block";
    body.style.backgroundColor = "rgba(0, 0, 0,0.5)";
    post.classList.add("blur");
    searchBar.classList.add("blur");
});

cancel.addEventListener("click",function(){
    postCreation.style.display = "none";
    body.style.backgroundColor = "rgba(0, 0, 0,0)";
    post.classList.remove("blur");
    searchBar.classList.remove("blur");
});

//Edit own post
const editPost = document.getElementById("editPost");
const postUpdate = document.getElementById("postUpdate")
const updateCancel =  document.getElementById("updateCancel");

editPost.addEventListener("click",function(){
    postUpdate.style.display = "block";
    body.style.backgroundColor = "rgba(0, 0, 0,0.5)";
    post.classList.add("blur");
    searchBar.classList.add("blur");
});

updateCancel.addEventListener("click",function(){
    postUpdate.style.display = "none";
    body.style.backgroundColor = "rgba(0, 0, 0,0)";
    post.classList.remove("blur");
    searchBar.classList.remove("blur");
});

//Display post
async function fetchPosts() {
    try{
        const response = await fetch("/posts"); // Replace with your API endpoint
        const data = await response.json();
      
        const forum = document.getElementById("post");
      
        data.forEach((post) => {
            const dateObj = new Date(post.date_column);
            const formattedDate = dateObj.toISOString().split('T')[0];
            const container = document.createElement("div");
            container.classList.add('card', 'flex-md-row', 'mb-4', 'box-shadow', 'h-md-250');// Add a CSS class for styling
            container.innerHTML = `
            <div class="card-body d-flex flex-column align-items-start">
                      <div style="display: flex;">
                          <div>
                              <b>Joe mama</b>
                              <p>Posted on: ${formattedDate}</p>
                          </div>
                          <img src="../images/EditBtn.png" alt="edit post" id="editPost" style="height: fit-content;">
                      </div>
                      <h2>${post.header}</h2>
                      <p>${post.message}</p>
                      <div>
                          <h5>comments</h5>
                          <form class="form-inline">
                              <input class="form-control mr-sm-2" type="search" placeholder="Comment" aria-label="Search">
                              <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Send</button>
                          </form>
                          <br>
                          <div id="comment" style="border: 1;"></div>
                      </div>
                  </div>
            `;
          
          
            forum.appendChild(container);
            const bElements = container.querySelectorAll("b");
            const pElements = container.querySelectorAll("p");
            
            bElements[0].textContent = "Name of user that posted"
            //pElements[0].textContent = "Time posted by user"
            const titleElement = container.querySelector("h2");
          
           // titleElement.textContent = `Header: ${post.header}`;
            //pElements[1].textContent = `bodymsg: ${post.message}`
          
            // Fetch comments for each post
            //fetchComments(post.id);
        });
    }catch (error) {
        console.error('Error fetching posts:', error);
    }
  }

window.onload = fetchPosts();
//fetchPosts(); // Call the function to fetch and display post data

async function fetchComments(postId) {
    try {
        const response = await fetch(`/comments?postId=${postId}`); // Replace with your comments API endpoint
        const comments = await response.json();

        const commentSection = document.getElementById(`comment`);

        comments.forEach((comment) => {
            const commentDiv = document.createElement('div');
            commentDiv.innerHTML = `
                <b>${comment.commenter_name}</b>
                <p>${comment.created_at}</p>
                <p>${comment.comment}</p>
            `;
            commentSection.appendChild(commentDiv);
        });
    } catch (error) {
        console.error(`Error fetching comments for post ID ${postId}:`, error);
    }
}

const forum = document.getElementById("post");
  const container = document.createElement("div");
  container.classList.add('card', 'flex-md-row', 'mb-4', 'box-shadow', 'h-md-250');// Add a CSS class for styling
  container.innerHTML = `
  <div class="card-body d-flex flex-column align-items-start">
            <div style="display: flex;">
                <div>
                    <b>Joe mama</b>
                    <p>5 hours ago</p>
                </div>
                <img src="../images/EditBtn.png" alt="edit post" id="editPost" style="height: fit-content;">
            </div>
            <h2>Industrial Evolution: Navigating the Future of Agriculture.</h2>
            <p>In augue ligula, feugiat ut nulla consequat. Ut est lacus, molestie in arcu no, iaculis vehicula ipsum. Nunc faucibus, nisl id dapibus finibus, enim diam interdum nulla, sed laoreet risus lectus. </p>
            <div>
                <h5>comments</h5>
                <form class="form-inline">
                    <input class="form-control mr-sm-2" type="search" placeholder="Comment" aria-label="Search">
                    <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Send</button>
                </form>
                <br>
                <div id="comment" style="border: 1;"></div>
            </div>
        </div>
  `;


  forum.appendChild(container);
  const bElements = container.querySelectorAll("b");
  const pElements = container.querySelectorAll("p");
  
  bElements[0].textContent = "Name of user that posted"
  pElements[0].textContent = "Time posted by user"
  const titleElement = container.querySelector("h2");

  titleElement.textContent = `Header: ${post.header}`;
  pElements[1].textContent = `bodymsg: ${post.message}`

  // Fetch comments for each post
  fetchComments(post.id);