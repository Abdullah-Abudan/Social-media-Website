let CURRENT_PAGE = 1;
let LAST_PAGE = 1;
// getPosts Function
function getPosts(page = 1) {
  ToggleLoader(true);
  axios
    .get(`${BASE_URL}/posts?limit=5&page=${page}`)
    .then((response) => {
      ToggleLoader(false);
      const posts = response.data.data;
      console.log(posts);
      LAST_PAGE = response.data.meta.last_page;
      posts.map((post) => {
        console.log(typeof post.image); // object == no image >> string == exist image

        // show or hide (edit) button
        const isMyPost = GetCurrentUser().id == post.author.id;
        let EditButton = ``;
        let DeleteButton = ``;

        if (isMyPost) {
          EditButton = ` 
         <button class="edit-post" id="edit-post" onclick ='EditPost("${encodeURIComponent(
           JSON.stringify(post)
         )}")'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="rgb(29 81 170)" class="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
          </button> `;

          DeleteButton = `            
          <button type="button" data-post-id="${post.id}" id="data-post-id" class="delete-post"  data-bs-toggle="modal" data-bs-target="#deleteModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
          </svg>
          </button>`;
        }

        const content = `
          <div class="d-md-flex justify-content-center mt-5">
            <div class="col-sm-12 col-md-9">
              <div class="card shadow-sm">
                <div class="card-header bg-transparent d-flex align-items-center gap-2 position-relative">
                
                <div onclick="UserProfile(${post.author.id})"> 
                <img src="${
                  typeof post.author.profile_image == "object" ? "" : post.author.profile_image
                }" alt="user" width="50px" height="50px" class="border border-2 rounded-circle p-1 cursor-pointer">
                  <span class="text-decoration-none fw-bold user-select-none cursor-pointer">@${
                    post.author.username
                  }
                  </span>
                </div>
                  <!-- Start Edit Post Button -->
                  ${EditButton}
                  <!-- End Edit Post Button -->       
                  <!-- Start Delete Post Button -->
                  ${DeleteButton}
                  <!-- End Delete Post Button -->       
                  </div>        
                  <div class="card-body cursor-pointer" onclick="PostDetailes(${
                    post.id
                  })">
                    <img src="${
                     typeof post.image == "object" ? "": post.image
                    }" class="img-thumbnail">
                    <h6 class="pt-2 text-dark-emphasis">${post.created_at}</h6>
                    <h5>${post.title ? post.title : ""}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <div class="d-flex align-items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                        <span>
                          (${post.comments_count}) Comments
                          <span id="post-tags-${post.id}">
                            ${post.tags
                              .map(
                                (tag) =>
                                  `
                              <button class="btn btn-secondary btn-sm rounded-5 text-white fw-bold">
                                ${tag.name}
                                </button>
                                `
                              )
                              .join(" ")}
                                </span>
                                </span>
                                </div>
                                </div>
                                </div>                    
                                </div>
                                </div>
                                `;
        document.getElementById("posts").innerHTML += content;
      });
    })
    .catch((error) => {
      ShowToast("error", "text-danger", error.response.data.message);
    })
    .finally(() => {
      ToggleLoader(false);
    });
}
getPosts();

// I will apply the Reusable to the Function so that it is for Editing and Adding
// CreateNewPost Function (I moved it to common js file)

// Start Infinite Scroll "Pagination"
window.addEventListener("scroll", (e) => {
  e.preventDefault();
  // To see if the user has reached the end of the page or not
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  if (endOfPage && CURRENT_PAGE < LAST_PAGE) {
    CURRENT_PAGE++;
    getPosts(CURRENT_PAGE);
  }
});
// End Infinite Scroll

// Post Detailes Function
function PostDetailes(postId) {
  location.href = `../Details/postDetails.html?postId=${postId}`;
}

// Create Post Function for modal | reusable Modal after remove data Attribute an add onclick

const CreatePost = () => {
  // Set the Title text and button submit text
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("post-modal-btn").innerHTML = "Create";

  document.getElementById("post-id-input").value = "";

  const PostModal = new bootstrap.Modal(
    document.getElementById("post-modal"),
    {}
  );
  PostModal.toggle(); // hide and show Modal
};

// Edit Post Function for modal (I moved it to common js file)
// Delete Post Function for modal (I moved it to common js file)

function UserProfile(userId) {
  location.href = `../Profile/profile.html?userId=${userId}`;
}
