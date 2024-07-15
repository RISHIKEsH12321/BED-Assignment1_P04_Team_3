// Done by Joseph
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
const navbar = document.getElementById("parentNav");
newPost.addEventListener("click",function(){
    postCreation.style.display = "block";
    body.style.backgroundColor = "rgba(0, 0, 0,0.5)";
    post.classList.add("blur");
    searchBar.classList.add("blur");
    navbar.classList.add("blur");
});

cancel.addEventListener("click",function(){
    postCreation.style.display = "none";
    body.style.backgroundColor = "rgba(0, 0, 0,0)";
    post.classList.remove("blur");
    searchBar.classList.remove("blur");
    navbar.classList.remove("blur");
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
                          <img src="../images/EditBtn.png" alt="edit post" id="editPost${post.post_id}" style="height: fit-content;" type="button" onclick="fetchIdPost(${post.post_id})">
                      </div>
                      <h2>${post.header}</h2>
                      <p>${post.message}</p>
                      <div>
                          <h5>comments</h5>
                          <form class="form-inline" action="/comments" method="POST">
                              <input id="commentMessage" class="form-control mr-sm-2" name="comment" placeholder="Comment">
                              <input id="comment_post_id" type="hidden" name="post_id" value="${post.post_id}">
                              <button id="commentForm_${post.post_id}" class="btn btn-outline-primary my-2 my-sm-0" type="button">Send</button>
                          </form>
                          <br>
                          <div id="comment${post.post_id}" style="border: 1;"></div>
                      </div>
                  </div>
            `;

            forum.appendChild(container);

            //console.log(post.post_id);
            fetchComments(post.post_id);

            const form = document.getElementById(`commentForm_${post.post_id}`)
            form.addEventListener("click",async()=>{
                //Add function to update text and sql database
                const comment = document.getElementById("commentMessage").value;
                const id = document.getElementById("comment_post_id").value;
                console.log(id + "," + comment);
                try {
                    const response = await fetch(`/comments`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          post_id: id,
                          comment: comment
                        })
                    });
                    if (!response.ok) {
                        const errorMessage = await response.json()
                        throw new Error(`${errorMessage.errors}`);
                    }
            
                    location.reload();
                }catch (error) {
                    console.error('Error fetching posts:', error);
                    showToast(error);
                }
                
            });
            
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
                          <img src="../images/EditBtn.png" alt="edit post" id="editPost${post.post_id}" style="height: fit-content;" type="button" onclick="fetchIdPost(${post.post_id})">
                      </div>
                      <h2>${post.header}</h2>
                      <p>${post.message}</p>
                      <div>
                          <h5>comments</h5>
                          <form class="form-inline" action="/comments" method="POST">
                              <input id="commentMessage" class="form-control mr-sm-2" name="comment" placeholder="Comment">
                              <input id="comment_post_id" type="hidden" name="post_id" value="${post.post_id}">
                              <button id="commentForm_${post.post_id}" class="btn btn-outline-primary my-2 my-sm-0" type="button">Send</button>
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

            
            const form = document.getElementById(`commentForm_${post.post_id}`)
            form.addEventListener("click",async()=>{
                //Add function to update text and sql database
                const comment = document.getElementById("commentMessage").value;
                const id = document.getElementById("comment_post_id").value;
                console.log(id + "," + comment);
                try {
                    const response = await fetch(`/comments`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          post_id: id,
                          comment: comment
                        })
                    });
                    if (!response.ok) {
                        const errorMessage = await response.json()
                        throw new Error(`${errorMessage.errors}`);
                    }
            
                    location.reload();
                }catch (error) {
                    console.error('Error fetching posts:', error);
                    showToast(error);
                }
                
            });
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


//Show selected post for user to update
async function fetchIdPost(searchTerm) {
    try{
        const response = await fetch(`/post/id/${searchTerm}`); // Replace with your API endpoint
        const data = await response.json();

        const postUpdate = document.getElementById("postUpdate");
      
        const dateObj = new Date(data.date_column);
        const formattedDate = dateObj.toISOString().split('T')[0];
        postUpdate.innerHTML = `
        <br>
        <div class="row">
            <div class="col">
                <b>Jonas</b>
            </div>
            <div class="col text-right" >
                <img src="../images/addMedia.png" alt="add media">
            </div>
        </div>
        <br>
        <form>
            <div class="form-group">
              <input id="headerInput" class="form-control" name="header" value="${data.header}">
            </div>
            <div class="form-group">
                <textarea id="messageTextarea" class="form-control" name="message">${data.message}</textarea>
            </div>
            <div class="row">
                <div class="col-sm-4 text-center">
                    <button type="button" id="updateCancel" class="btn btn-primary">Cancel</button>
                </div>
                <div class="col-sm-4 text-center">
                    <button type="button" id="updateDelete" class="btn btn-danger">DELETE</button>
                </div>
                <div class="col-sm-4 text-center">
                    <button type="button" id="updatePost" class="btn btn-success">Update</button>
                </div>
            </div>
        </form>
        <br>
        `;

        postUpdate.style.display = "block";
        body.style.backgroundColor = "rgba(0, 0, 0,0.5)";
        post.classList.add("blur");
        searchBar.classList.add("blur");

        const cancel = document.getElementById("updateCancel");
        cancel.addEventListener("click",function(){
            postUpdate.style.display = "none";
            body.style.backgroundColor = "rgba(0, 0, 0,0)";
            post.classList.remove("blur");
            searchBar.classList.remove("blur");
        });

        const update = document.getElementById("updatePost");
        update.addEventListener("click",async()=>{
            //Add function to update text and sql database
            const header = document.getElementById("headerInput").value;
            const message = document.getElementById("messageTextarea").value;
            console.log(data.post_id + "," + header + "," + message);
            try {
                const response = await fetch(`/forum/update/${data.post_id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      header: header,
                      message: message
                    })
                });
                if (!response.ok) {
                    const errorMessage = await response.json()
                    throw new Error(`${errorMessage.errors}`);
                }
        
                console.log('Post updated successfully!');
                location.reload();
            }catch (error) {
                console.error('Error fetching posts:', error);
                showToast(error);
            }

            postUpdate.style.display = "none";
            body.style.backgroundColor = "rgba(0, 0, 0,0)";
            post.classList.remove("blur");
            searchBar.classList.remove("blur");
        });

        const deletePost = document.getElementById("updateDelete");
        deletePost.addEventListener("click",function(){
            //Add function to delete post and sql database
            console.log(data.post_id);
            postDelete(data.post_id)
            postUpdate.style.display = "none";
            body.style.backgroundColor = "rgba(0, 0, 0,0)";
            post.classList.remove("blur");
            searchBar.classList.remove("blur");
        });
    }catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function postDelete(post_id){
    try {
        await fetch(`/forum/delete/${post_id}`,{method: `DELETE`})
        location.reload();
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
  
    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        // Remove the toast from the DOM after it fades out
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 500);
    }, 3000);
}

const postForm = document.getElementById("postCreationSubmit");
postForm.addEventListener("click",async()=>{
    //Add function to update text and sql database
    const header = document.getElementById("headerInput").value;
    const message = document.getElementById("messageTextarea").value;
    console.log(header + "," + message);
    try {
        const response = await fetch(`/forum/post`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              header: header,
              message: message
            })
        });
        if (!response.ok) {
            const errorMessage = await response.json()
            throw new Error(`${errorMessage.errors}`);
        }

        console.log('Post updated successfully!');
        postCreation.style.display = "none";
        body.style.backgroundColor = "rgba(0, 0, 0,0)";
        post.classList.remove("blur");
        searchBar.classList.remove("blur");
        navbar.classList.remove("blur");
        location.reload();
    }catch (error) {
        console.error('Error fetching posts:', error);
        showToast(error);
    }

});
