// Done by Joseph

//Current User
const user_id = localStorage.getItem("user_id");
const admin_id = localStorage.getItem("admin_id");
const username = localStorage.getItem("username");

window.onload = fetchPosts();
async function fetchPosts() {
    try{
        const response = await fetch("/admin/posts",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            user_id:user_id,
            admin_id:admin_id,
            token:token
            })
        }
        ); // Replace with your API endpoint
        const data = await response.json();
      
        const id = document.getElementById("tableID");
        id.textContent = "POST ID";
        const type = document.getElementById("type");
        type.textContent = "Type";
        const forum = document.getElementById("tableBody");
        forum.innerHTML = '';
      
        data.forEach((post) => {
            const dateObj = new Date(post.date_column);
            const formattedDate = dateObj.toISOString().split('T')[0];
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
            <td>${post.post_id}</td>
            <td>${formattedDate}</td>
            <td>Agriculture</td>
            <td><button onclick="fetchSearchedPosts(${post.post_id})" type="button" class="btn btn-primary">Read</button></td>  
            `;

            forum.appendChild(tableRow);
        });
    }catch (error) {
        console.error('Error fetching posts:', error);
    }
}



//Display Searched post
async function fetchSearchedPosts(searchTerm) {
    try{
        const response = await fetch(`/admin/posts/${searchTerm}`); // Replace with your API endpoint
        const data = await response.json();

        const adminPost = document.getElementById("post");
        adminPost.innerHTML = "";
      
        const dateObj = new Date(data.date_column);
        const formattedDate = dateObj.toISOString().split('T')[0];
        const container = document.createElement("div");
        container.classList.add('card', 'flex-md-row', 'mb-4', 'box-shadow', 'h-md-250');// Add a CSS class for styling
        container.innerHTML = `
        <div class="card-body d-flex flex-column align-items-start">
            <b>Jonas</b>
            <p>${formattedDate}</p>
            <h2>${data.header}</h2>
            <p>${data.message}</p>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <button type="button" class="btn btn-primary" id="cancel">Close</button>
                    </div>
                    <div class="col text-right">
                        <button type="button" class="btn btn-danger" id="adminDelete">Delete</button>
                    </div>
                </div>
            </div>          
        </div>
        `;
      
      
        adminPost.appendChild(container);

        adminPost.style.display = "block";
        const cancel = document.getElementById("cancel");
        cancel.addEventListener("click",function(){
            adminPost.style.display = "none";
            document.body.style.backgroundColor = "#F7FFEC";
        });

        const deletePost = document.getElementById("adminDelete");
        deletePost.addEventListener("click",function(){
            //Add function to delete post and sql database
            console.log(data.post_id);
            postDelete(data.post_id)
            adminPost.style.display = "none";
            document.body.style.backgroundColor = "#F7FFEC";
        });
    }catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function fetchComments() {
    try{
        const response = await fetch("/admin/forum/comments"); // Replace with your API endpoint
        const data = await response.json();

        const id = document.getElementById("tableID");
        id.textContent = "COMMENT ID";
        const type = document.getElementById("type");
        type.textContent = "POST ID";
        const forum = document.getElementById("tableBody");
        forum.innerHTML = '';
      
        data.forEach((comment) => {
            const dateObj = new Date(comment.date_column);
            const formattedDate = dateObj.toISOString().split('T')[0];
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
            <td>${comment.comment_id}</td>
            <td>${formattedDate}</td>
            <td>${comment.post_id}</td>
            <td><button onclick="fetchSearchedComments(${comment.comment_id})" type="button" class="btn btn-primary">Read</button></td>  
            `;

            forum.appendChild(tableRow);
        });
    }catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function fetchSearchedComments(searchTerm) {
    try{
        const response = await fetch(`/admin/forum/comments/${searchTerm}`); // Replace with your API endpoint
        const data = await response.json();

        const adminComment = document.getElementById("comment");
        adminComment.innerHTML = "";
      
        const dateObj = new Date(data.date_column);
        const formattedDate = dateObj.toISOString().split('T')[0];
        const container = document.createElement("div");
        container.classList.add('card', 'flex-md-row', 'mb-4', 'box-shadow', 'h-md-250');// Add a CSS class for styling
        container.innerHTML = `
        <div class="card-body d-flex flex-column align-items-start">
            <b>Jonas</b>
            <p>${formattedDate}</p>
            <p>${data.message}</p>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <button type="button" class="btn btn-primary" id="cancel">Close</button>
                    </div>
                    <div class="col text-right">
                        <button type="button" class="btn btn-danger" id="adminDelete">Delete</button>
                    </div>
                </div>
            </div>          
        </div>
        `;
      
      
        adminComment.appendChild(container);

        adminComment.style.display = "block";
        const cancel = document.getElementById("cancel");
        cancel.addEventListener("click",function(){
            adminComment.style.display = "none";
            document.body.style.backgroundColor = "#F7FFEC";
        });

        const deleteComment = document.getElementById("adminDelete");
        deleteComment.addEventListener("click",function(){
            //Add function to delete post and sql database
            console.log(data.comment_id);
            commentDelete(data.comment_id)
            adminComment.style.display = "none";
            document.body.style.backgroundColor = "#F7FFEC";
        });
    }catch (error) {
        console.error('Error fetching comments:', error);
    }
}

const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", function(event){
    event.preventDefault();

    const value = document.getElementById("search").value;
    fetchSearchedPosts(value)
});

async function postDelete(post_id){
    try {
        await fetch(`/admin/forum/delete/${post_id}`,{method: `DELETE`})
        fetchPosts();
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function commentDelete(comment_id){
    try {
        await fetch(`/admin/forum/comment/delete/${comment_id}`,{method: `DELETE`})
        fetchComments();
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}