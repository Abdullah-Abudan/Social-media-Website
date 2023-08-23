// BaseURL for Code Reusability
const BASE_URL = "https://tarmeezacademy.com/api/v1";

// Register Function
function Register(e) {
  e.preventDefault();
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const email = document.getElementById("register-email-input").value;
  const password = document.getElementById("register-password-input").value;
  const Image = document.getElementById("register-image-input").files[0];

  const data = new FormData();
  data.append("name", name);
  data.append("username", username);
  data.append("email", email);
  data.append("password", password);
  data.append("image", Image);

  ToggleLoader(true)
  axios.post(`${BASE_URL}/register`, data)
    .then((res) => {
      ToggleLoader(false)
      console.log(res);
      const { token, user } = res.data; // Object Destructuring
      localStorage.token = token;
      localStorage.user = JSON.stringify(user); //Convert the user object to a string and store it in local storage

      // Start steps to hide the modal
      // Get the modal element
      const modal = document.getElementById("register-modal");
      // Get the Bootstrap modal instance
      const modalInstance = bootstrap.Modal.getInstance(modal);
      // Hide the modal
      modalInstance.hide();
      // End steps to hide the modal

      document.getElementById("username").innerHTML = username; //to add it to the header toast
      // show an alert after the token is storage successfully
      ShowToast("register", "text-success");
      SetupUI();
    })
    .catch((error) => {
      ShowToast("error", "text-danger", error.response.data.message);
    })
    .finally(()=> {
      ToggleLoader(false)
    })
}

// Login Function
function Login(e) {
  // e.preventDefault()
  const username = document.getElementById("input-username").value;
  const password = document.getElementById("input-password").value;
  const data = {
    username: username,
    password: password,
  };
  ToggleLoader(true)
  axios.post(`${BASE_URL}/login`, data)
    .then((res) => {
      ToggleLoader(false)
      let token = res.data.token;
      localStorage.token = token;
      let user = res.data.user;
      localStorage.user = JSON.stringify(user); //Convert the user object to a string and store it in local storage
      // Start steps to hide the modal
      // Get the modal element
      const modal = document.getElementById("login-modal");
      // Get the Bootstrap modal instance
      const modalInstance = bootstrap.Modal.getInstance(modal);
      // Hide the modal
      modalInstance.hide();
      // End steps to hide the modal
      document.getElementById("username").innerHTML = username; //to add it to the header toast
      // show an alert after the token is storage successfully
      ShowToast("login", "text-success");
      SetupUI();
      setTimeout(() => {
        location.reload()
      }, 1500);
    })
    .catch((error) => {
      ShowToast("error", "text-danger", error.response.data.message);
    })
    .finally(()=> {
      ToggleLoader(false)
    })
}

// Logout Function
function Logout() {
  localStorage.clear();
  ShowToast("logout", "text-danger");
  SetupUI();
  setTimeout(() => {
    location.reload()
  }, 1500);
}

// Current User Function
function GetCurrentUser() {
  let storageUser = localStorage.user;
  //Convert the user string in local storage to a json
  return storageUser ? JSON.parse(storageUser) : "";
}
// To control the appearance of the buttons
function SetupUI() {
  const token = localStorage["token"];
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const addPostBtn = document.getElementById("add-post");
  const userInfo = document.getElementById("user-info");
  const navUsername = document.getElementById("nav-username")
  const navImage = document.getElementById("nav-image")
  const addCommentDiv = document.getElementById("add-comments-div");
  const editPostBtn = document.getElementById("edit-post");


  // User is Guest (Not Logged in)
  if (token == null) {
    loginBtn.style.display = "inline";
    registerBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    if (addPostBtn != null ||editPostBtn != null) { // للتأكد من انه موجودة بالصفحة 
      // because he not exists in post Details
      addPostBtn.style.display = "none";
    }
    if (addCommentDiv != null) {
      // because he not exists in home
      addCommentDiv.style.setProperty("display", "none", "important");
    }
    userInfo.style.setProperty("display", "none", "important");
  }
  // User is Admin (Logged in)
  else {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "inline";
    if (addPostBtn != null || editPostBtn != null) {
      addPostBtn.style.display = "inline";
    }
      userInfo.style.display = "flex";
      navUsername.innerHTML = GetCurrentUser().username;
      navImage.src = GetCurrentUser().profile_image;
    

    if (addCommentDiv != null) {
      addCommentDiv.style.setProperty("display", "flex", "important");
    }
  }
}
SetupUI();

// Show the Toast Function
function ShowToast(action, color, error) {
  let options = {
    delay: 3500,
  };
  const toast = document.getElementById("toast");
  const toastInstance = new bootstrap.Toast(toast, options);
  toastInstance.show();

  let message;
  const toastBody = toast.querySelector(".toast-body");
  switch (action) {
    case "login":
      message = "Logged in Successfully";
      break;
    case "logout":
      message = "Logged out Successfully";
      break;
    case "register":
      message = "New User Registered Successfully";
      break;
    case "add-post":
      message = "Your post has been added successfully";
      break;
    case "edit-post":
      message = "Your post has been Edited successfully";
      break;
    case "delete-post":
      message = "Your post has been Deleted successfully";
      break;
    case "add-comment":
      message = "Your comment has been added successfully";
      break;
    case "error":
      message = error;
      toastBody.innerHTML = `<span class="${color} fw-bold">${message}</span>`;
      const toastHeader = document.getElementById("username");
      toastHeader.innerHTML = " ";
      break;
    default:
      break;
  }

  if (message != error) {
    toastBody.innerHTML = `<span class="${color} fw-bold">${message}</span> `;
  }
}

// CreateNewPost Function
function CreateUpdatePost(e) {
  e.preventDefault();

  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];
  const token = localStorage.token;

  const bodyFormData = new FormData();
  bodyFormData.append("title", title);
  bodyFormData.append("body", body);
  bodyFormData.append("image", image);

  let URL = ``;
  const headers = { Authorization: `Bearer ${token}` };

  //يساعدني انه اعرف اذا ضغطت  ع البتن لتعديل بوست او لانشاء بوست
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == ""; // في هذه الحالة بعرف ان المطلوب انشاء بوست

  if (isCreate) {
    URL = `${BASE_URL}/posts`;
    ToggleLoader(true)
    axios.post(URL, bodyFormData, { headers })
      .then((res) => {
        ToggleLoader(false)
        console.log(res);
        // Start steps to hide the modal
        const modal = document.getElementById("post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        // End steps to hide the modal

        // show an alert after the token is storage successfully
        ShowToast("add-post", "text-success");
        setTimeout(()=>{
          location.reload(); 
        },1000)

      })
      .catch((error) => {
        ShowToast("error", "text-danger", error.response.data.message);
      })
      .finally(()=> {
        ToggleLoader(false)
      })
  } else {
    bodyFormData.append("_method", "put");
    URL = `${BASE_URL}/posts/${postId}`;
    ToggleLoader(true)
    axios.post(URL, bodyFormData, { headers })
      .then((res) => {
        ToggleLoader(false)
        console.log(res);
        // Start steps to hide the modal
        const modal = document.getElementById("post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        // End steps to hide the modal

        // show an alert after the token is storage successfully
        ShowToast("edit-post", "text-success");
        // Update posts list immediately after creating a new post
        setTimeout(()=>{
          location.reload(); 
        },1000)
      })
      .catch((error) => {
        ShowToast("error", "text-danger", error.response.data.message);
      })
      .finally(()=> {
        ToggleLoader(false)
      })
  }
}

// Edit Post Function for modal
const EditPost = (postString) => {
  const post = JSON.parse(decodeURIComponent(postString));
  // console.log(post.body + post.id + post.title);

  document.getElementById("post-id-input").value = post.id;

  // Set the Title text and button submit text
  document.getElementById("post-modal-title").innerHTML = "Update Post";
  document.getElementById("post-modal-btn").innerHTML = "Update";

  // Set the input field values to showing data
  document.getElementById("post-title-input").value = post.body;
  document.getElementById("post-body-input").value = post.title;

  const PostModal = new bootstrap.Modal(
    document.getElementById("post-modal"),
    {}
  );
  PostModal.toggle(); // hide and show Modal
};

// Delete Post Function for modal
const DeletePost = () => {
  const postId =  document.getElementById("data-post-id").dataset.postId

  const token = localStorage.token;
  let URL = ``;
  const headers = { Authorization: `Bearer ${token}` };
    URL = `${BASE_URL}/posts/${postId}`;
    ToggleLoader(true)
    axios.delete(URL, { headers })
      .then((res) => {
        ToggleLoader(false)
        console.log(res);
        ShowToast("delete-post", "text-danger");
        setTimeout(()=>{
          location.reload(); 
        },1000)
      })
      .catch((error) => {
        ShowToast("error", "text-danger", error.response.data.message);
      })
      .finally(()=> {
        ToggleLoader(false)
      })
    }


function profileClicked() {
  location.href = `../Profile/profile.html?userId=${GetCurrentUser().id}`
}    

// Loader Function
function ToggleLoader(show = true) {
  if(show) {
    document.getElementById("loader").style.visibility = "visible"
  } 
  else {
    document.getElementById("loader").style.visibility = "hidden"
  }
}