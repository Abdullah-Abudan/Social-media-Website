function UserId() {
  const urlParams = new URLSearchParams(location.search);
  const userId = urlParams.get("userId"); // key in URL
  return userId;
}

function getUsers(userId = UserId()) {
  axios
    .get(`${BASE_URL}/users/${userId}`)
    .then((res) => {
      ToggleLoader(false);
      const users = res.data.data;
      console.log(users);
      const content = `
          <div class="d-md-flex justify-content-center mb-5">
          <div class="col-sm-12 col-md-9">
              <h1 class="p-3 p-md-0 pb-md-3 "><span>Profile</span> Info</h1>
              <div class="card shadow-sm mb-4">
                  <div class="card-body d-flex p-4">
                      <div class="row w-100">
                          <div class="col-12 col-lg-6 d-flex flex-row gap-3 gap-sm-5">
                              <!-- User Image -->
                              <div class="border border-3 rounded-circle">
                                  <img src="${typeof users.profile_image == "object" ? "" : users.profile_image}"
                                      class="rounded-circle p-1" width="100" height="100" alt="user">
                              </div>
                              <!-- UserName & Email & Name -->
                              <div
                                  class="d-flex flex-column flex-grow-1 flex-lg-grow-0 justify-content-evenly align-items-center align-items-lg-start ">
                                  <h6>${users.username}</h6>
                                  <h6>${users.email}</h6>
                                  <h6>${users.name}</h6>
                              </div>
                          </div>
                          <!-- Posts & Comments Count -->
                          <div
                              class="col-12 col-md-6 d-flex justify-content-between flex-md-column justify-content-md-evenly pt-2 pt-md-0">
                              <span><span class="pe-2 fs-2 fw-light">${users.posts_count}</span><sub
                                      class="fs-5 text-secondary">Posts</sub></span>
                              <span><span class="pe-2 fs-2 fw-light">${users.comments_count}</span><sub
                                      class="fs-5 text-secondary">Comments</sub></span>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </div>
          `;
      document.getElementById("main-info").innerHTML = content;
    })
    .catch((error) => {
      ShowToast("error", "text-danger", error.response.data.message);
      ToggleLoader(false);
    });
}
getUsers();

function getPosts(userId = UserId()) {
  axios.get(`${BASE_URL}/users/${userId}/posts`).then((res) => {
    ToggleLoader(false);
    const posts = res.data.data;
    console.log(posts);
    posts.forEach((post) => {
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

      const contentHeader = `
      <div class="d-md-flex justify-content-center">
      <div class="col-12 col-md-9">
          <h1 class="p-3 p-md-0 pb-md-3 "><span>${post.author.name}'s</span> Post</h1>
      </div>
      </div>
      `;

      const contentBody = `
      <div class="d-md-flex justify-content-center mb-5">
      <div class="col-12 col-md-9">
    
          <div class="card shadow-sm">
              <div class="card-header bg-transparent d-flex align-items-center gap-2">
                  <img src="${
                    typeof post.author.profile_image == "object" ? "" : post.author.profile_image
                  }" alt="user" width="50px" height="50px" class="border border-2 rounded-circle p-1">
                  <span class="text-decoration-none fw-bold user-select-none">
                  @${post.author.username}
                  </span>
                  
                  <!-- Start Edit Post Button -->
                  ${EditButton}
                  <!-- End Edit Post Button -->
      
                  <!-- Start Delete Post Button -->
                  ${DeleteButton}
                  <!-- End Delete Post Button -->

              </div>
              <div class="card-body cursor-pointer">
                  <img src="${typeof post.image == "object" ? "": post.image}" height="10px" class="img-thumbnail">
                  <h6 class="pt-2 text-dark-emphasis">${post.created_at}</h6>
                  <h5>${post.title ? post.title : ""}</h5>
                  <p>${post.body}</p>
                  <hr>
                  <div class="d-flex align-items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                          class="bi bi-pen" viewBox="0 0 16 16">
                          <path
                              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
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
      document.querySelector("#posts #post-body").innerHTML += contentBody;
      document.querySelector("#posts #post-header").innerHTML = contentHeader;
    });
  });
}
getPosts();
