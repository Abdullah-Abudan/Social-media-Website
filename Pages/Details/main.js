const urlParams = new URLSearchParams(location.search);
const postId = urlParams.get("postId"); // key in URL
// console.log(postId);

function getPostDetailes() {
  ToggleLoader(true)
  axios.get(`${BASE_URL}/posts/${postId}`)
    .then((response) => {
      ToggleLoader(false)
      const post = response.data.data;

      console.log(response);
      const content = `
      <div class="d-md-flex justify-content-center mb-5">
        <div class="col-sm-12 col-md-9">
        <h1 class="p-3 p-md-0 pb-md-3 "><span>${post.author.name}</span> Post</h1>
          <div class="card shadow-sm">
            <div class="card-header bg-transparent d-flex align-items-center gap-2">
              <img src="${
                typeof post.author.profile_image == "object" ? "" : post.author.profile_image
              }" alt="user" width="50px" height="50px" class="border border-2 rounded-circle p-1">
              <span class="text-decoration-none fw-bold user-select-none">@${
                post.author.username
              }</span>
              </div>
              <div class="card-body cursor-pointer">
                <img src="${typeof post.image == "object" ? "": post.image}" height="10px" class="img-thumbnail">
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

                            <div id="comments" class="d-flex flex-column gap-2">
                            ${post.comments?.map((comment) => `
                              <div class="p-2 d-flex flex-column gap-2 justify-content-center">
                                <div class="d-flex align-items-center gap-2">
                                  <img id="comment-image" src="${comment.author.profile_image}" class="border border-2 border-secondary p-1 rounded-circle" alt="user" width="40" height="40">
                                  <strong id="comment-username">${comment.author.username}</strong>
                                </div>
                                <p id="comment-body">${comment.body}</p>
                              </div>
                            `).join("")}
                          </div>

                            <div id="add-comments-div" class="input-group my-2 px-1">
                            <input id="comment-input" type="text" class="form-control shadow-none" placeholder="Add Your Comment Here..">
                            <button type="submit" class="btn btn-primary" onclick="AddComment(event)">Send</button>
                            </div>



                            </div>                    
                            </div>
                            </div>
                            `;
      document.getElementById("posts").innerHTML = content;
    })
    .catch((error) => {
      ShowToast(error.response.data.message)
    })
    .finally(()=> {
      ToggleLoader(false)
    })
}
getPostDetailes();

// Add Comment Function

function AddComment(e) {
  e.preventDefault();
  const body = document.getElementById("comment-input").value;
  const comment = {
    body,
  };
  const token = localStorage.token;
  const headers = { Authorization: `Bearer ${token}` };
  ToggleLoader(true)
  axios.post(`${BASE_URL}/posts/${postId}/comments`, comment, { headers })
    .then((res) => {
      ToggleLoader(false)
      console.log(res);
      ShowToast("add-comment", "text-success");
      getPostDetailes();
    })
    .catch((error) => {
      ShowToast("error", "text-danger", error.response.data.message);
    })
    .finally(()=> {
      ToggleLoader(false)
    })
}
