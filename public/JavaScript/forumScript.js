//Getting id and username of user that logged in
const user_id = sessionStorage.getItem("user_id");
const username = sessionStorage.getItem("username");

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
const editPost = document.getElementsByClassName("editPost");
const postUpdate = document.getElementById("postUpdate")
const updateCancel =  document.getElementById("updateCancel");

// editPost.addEventListener("click",function(){
//     postUpdate.style.display = "block";
//     body.style.backgroundColor = "rgba(0, 0, 0,0.5)";
//     post.classList.add("blur");
//     searchBar.classList.add("blur");
// });

updateCancel.addEventListener("click",function(){
    postUpdate.style.display = "none";
    body.style.backgroundColor = "rgba(0, 0, 0,0)";
    post.classList.remove("blur");
    searchBar.classList.remove("blur");
});

//Display all post
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
                              <b>Name of user that posted</b>
                              <p>Posted on: ${formattedDate}</p>
                          </div>
                          <img src="../images/EditBtn.png" alt="edit post" id="editPost${post.post_id}" style="height: fit-content;" type="button">
                      </div>
                      <h2>${post.header}</h2>
                      <p>${post.message}</p>
                      <div>
                          <h5>comments</h5>
                          <form class="form-inline" action="/comments" method="POST">
                              <input class="form-control mr-sm-2" name="comment" placeholder="Comment">
                              <input type="hidden" name="post_id" value="${post.post_id}">
                              <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Send</button>
                          </form>
                          <br>
                          <div id="comment${post.post_id}" style="border: 1;"></div>
                      </div>
                  </div>
            `;

            
          
            forum.appendChild(container);

            //console.log(post.post_id);
            fetchComments(post.post_id);
        });
    }catch (error) {
        console.error('Error fetching posts:', error);
    }
  }

window.onload = fetchPosts(); 
//fetchPosts(); // Call the function to fetch and display post data

//Display comments on each post
async function fetchComments(postId) {
    try {
        const response = await fetch(`/comments/${postId}`); // Replace with your comments API endpoint
        const comments = await response.json();
        
        const commentSection = document.getElementById(`comment${postId}`);

        comments.forEach((comment) => {
            const dateObj = new Date(comment.date_column);
            const formattedDate = dateObj.toISOString().split('T')[0];
            const commentDiv = document.createElement('div');
            commentDiv.innerHTML = `
                <b>${comment.author}</b>
                <p>Commented on: ${formattedDate}</p>
                <p>${comment.message}</p>
            `;
            commentSection.appendChild(commentDiv);
        });
    } catch (error) {
        console.error(`Error fetching comments for post ID ${postId}:`, error);
    }
}

//Display Searched post
async function fetchSearchedPosts(searchTerm) {
    try{
        const response = await fetch(`/posts/${searchTerm}`); // Replace with your API endpoint
        const data = await response.json();
      
        const forum = document.getElementById("post");
        forum.innerHTML = "";
      
        data.forEach((post) => {
            const dateObj = new Date(post.date_column);
            const formattedDate = dateObj.toISOString().split('T')[0];
            const container = document.createElement("div");
            container.classList.add('card', 'flex-md-row', 'mb-4', 'box-shadow', 'h-md-250');// Add a CSS class for styling
            container.innerHTML = `
            <div class="card-body d-flex flex-column align-items-start">
                      <div style="display: flex;">
                          <div>
                              <b>Name of user that posted</b>
                              <p>Posted on: ${formattedDate}</p>
                          </div>
                          <img src="../images/EditBtn.png" alt="edit post" id="editPost${post.post_id}" style="height: fit-content;" type="button">
                      </div>
                      <h2>${post.header}</h2>
                      <p>${post.message}</p>
                      <div>
                          <h5>comments</h5>
                          <form class="form-inline" action="/comments" method="POST">
                              <input class="form-control mr-sm-2" name="comment" placeholder="Comment">
                              <input type="hidden" name="post_id" value="${post.post_id}">
                              <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Send</button>
                          </form>
                          <br>
                          <div id="comment${post.post_id}" style="border: 1;"></div>
                      </div>
                  </div>
            `;
          
          
            forum.appendChild(container);

          
            // Fetch comments for each post
            //console.log(post.post_id);
            fetchComments(post.post_id);
        });
    }catch (error) {
        console.error('Error fetching posts:', error);
    }
}

const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", function(event){
    event.preventDefault();

    const value = document.getElementById("search").value;
    fetchSearchedPosts(value)
});



