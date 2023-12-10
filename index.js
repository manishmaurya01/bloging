
const display = document.querySelector('.main-display');
const signupPopupContainer = document.getElementById('signupPopupContainer');
const loginPopupContainer = document.getElementById('loginPopupContainer');
const loginPopupBtn2 = document.querySelector("#loginBtn2");
const signupPopupBtn = document.querySelector("#signupBtn");
const loginPopupBtn = document.querySelector("#loginBtn");


loginPopupBtn2.addEventListener('click', () => {
  loginPopupContainer.style.display = 'block';
  document.querySelector('.side-nav').style.display = 'none';

});

signupPopupBtn.addEventListener('click', () => {
  signupPopupContainer.style.display = 'block';
  loginPopupContainer.style.display = 'none';
});

loginPopupBtn.addEventListener('click', () => {
  loginPopupContainer.style.display = 'block';
  
});

document.getElementById('closeSignupPopupBtn').addEventListener('click', () => {
  signupPopupContainer.style.display = 'none';
});
document.querySelector('.side-nav').style.display = 'none';
// JavaScript to toggle the side navigation
document.getElementById('closesidenav').addEventListener('click', function() {
  document.querySelector('.side-nav').style.display = 'none';

});

// JavaScript to show the side navigation
document.getElementById('opennav').addEventListener('click', function() {
  document.querySelector('.side-nav').style.display = 'flex';
});


document.getElementById('closeLoginPopupBtn').addEventListener('click', () => {
  loginPopupContainer.style.display = 'none';
});
const prv = document.querySelector(".prv");
prv.addEventListener('click', previewImage);

const sing = document.querySelector('.Signup');
sing.addEventListener('click', performSignup);

const loginn = document.querySelector('.loginme');
loginn.addEventListener('click', performLogin,);

const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener('click', performLogout);

const btn = document.querySelector("#uploadBtn");
btn.addEventListener('click', upload);

// Function to sign up a user
function signUp(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

// Function to log in a user
function logIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

// Function to log out the current user
function logOut() {
  return auth.signOut();
  
  
}

// Function to perform logout
function performLogout() {
  logOut()
    .then(() => {
      alert("now you are log out")
      location.reload();
      // Additional actions after logout (if needed)
    })
    .catch(error => {
      console.error("Error logging out:", error.message);
      // Handle error during logout (if needed)
    });
}

// Function to preview the selected image
function previewImage() {
  const input = document.querySelector("#photo");
  const preview = document.querySelector("#imagePreview");

  const file = input.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };

    reader.readAsDataURL(file);
  } else {
    preview.style.display = 'none';
  }
}


function performSignup() {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  signUp(email, password)
    .then(() => {
      alert("Account created successfully!");
       location.reload();
      closeSignupPopup();
    })
    .catch(error => {
      console.error("Error creating account:", error.message);
      alert("Error creating account: " + error.message);
    });
}

function performLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  logIn(email, password)
    .then(() => {
      alert("Login successful!");
      location.reload();
      closeLoginPopup();
    })
    .catch(error => {
      console.error("Error logging in:", error.message);
      alert("Error logging in: " + error.message);
    });
}

function closeSignupPopup() {
  document.getElementById('signupPopupContainer').style.display = 'none';
}

function closeLoginPopup() {
  document.getElementById('loginPopupContainer').style.display = 'none';
}

function fetchAndDisplayBlogs() {
  firebase.database().ref('blogPosts').orderByChild('timestamp').once('value')
    .then(snapshot => {
      snapshot.forEach(childSnapshot => {
        const blogData = childSnapshot.val();
        prependBlogPost(blogData.userEmail, blogData.imageUrl, blogData.content);
      });
    })
    .catch(error => {
      console.error("Error fetching blogs:", error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('event-listeners-added')) {
    document.body.classList.add('event-listeners-added');

    const openPopupBtn = document.getElementById('openPopupBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupContainer = document.getElementById('popupContainer');
    const uploadBtn = document.getElementById('uploadBtn');
    const openPopupBtn2 = document.getElementById('openPopupBtn2');
    openPopupBtn2.addEventListener('click', () => {
      popupContainer.style.display = 'block';
      document.querySelector('.side-nav').style.display = 'none';
    });

    openPopupBtn.addEventListener('click', () => {
      popupContainer.style.display = 'block';
    });

    closePopupBtn.addEventListener('click', () => {
      popupContainer.style.display = 'none';
    });
    

    uploadBtn.addEventListener('click', () => {
      upload();
    });

    fetchAndDisplayBlogs();
  }
});


const firebaseConfig = {
  apiKey: "AIzaSyB6W0VrCwyvpO0goBRPJPvKQUhOQPFbnZw",
  authDomain: "blogdb-adf1a.firebaseapp.com",
  projectId: "blogdb-adf1a",
  storageBucket: "blogdb-adf1a.appspot.com",
  messagingSenderId: "12222693538",
  appId: "1:12222693538:web:d8e4d84a7ef2f97f8f97fb",
  measurementId: "G-Q2H6WV682M"
};

firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const firestore = firebase.firestore();
const auth = firebase.auth();

let isUploading = false;
function upload() {

  if (isUploading) {
    // alert(" Please wait for it to complete.");
    alert("Please wait for it to complete.")
    return;
  }
  
  isUploading = true;

  const ref = firebase.storage().ref();
  const fileInput = document.querySelector("#photo");
  const file = fileInput.files[0];
  const content = document.querySelector("#content").value;
  const progress = document.getElementById('uploadProgress');

  const user = auth.currentUser;

  if (!user) {
    alert("User not logged in. Please log in to post a blog.");
    isUploading = false;
    return;
  }

  const userEmail = user.email;
  const timestamp = new Date().getTime();
  const name = `${userEmail}_${timestamp}_${file.name}`;

  const metadata = {
    contentType: file.type
  };

  const task = ref.child(name).put(file, metadata);

  task.on('state_changed',
    (snapshot) => {
      const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress.value = progressValue;
    },
    (error) => {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
      isUploading = false;
      progress.value = 0;
    },
    () => {
      task.snapshot.ref.getDownloadURL()
        .then(url => {
          firebase.database().ref('blogPosts').push({
            userEmail,
            imageUrl: url,
            content,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          });

          alert("Your Blog is uploaded successfully");
          prependBlogPost(userEmail, url, content);
          isUploading = false;
          progress.value = 0;
          document.getElementById("content").innerHTML=""
          location.reload;
          popupContainer.style.display = 'none';
        })
        .catch(error => {
          console.error("Error getting download URL:", error);
          alert("Error getting download URL");
          isUploading = false;
          progress.value = 0;
        });
    }
  );
}

function prependBlogPost(userEmail, imageUrl, content) {
  // Extract the part before "@" in the email
  const userName = userEmail.split('@')[0];

  const blogContainer = document.createElement('div');
  blogContainer.className = 'my-blogs';

  blogContainer.innerHTML = `
    <div class="blogs-display">
      <div class="names">
        <span>@${userName}</span>
        <hr>
      </div>
     
      <div class="blog">
        <div class="con">
          <img src="${imageUrl}" alt="${userName}">
          <div class="content">
            <p>${content}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  const myuser = document.querySelector(".c-user");

  // Fetch and display user's email in the profile section
  const user = auth.currentUser;
  if (user) {
    myuser.innerHTML = user.email;
  }
  const myuserr = document.querySelector(".c-userr");

  // Fetch and display user's email in the profile section
  const userr = auth.currentUser;
  if (userr) {
    myuserr.innerHTML = user.email;
  }
  display.insertBefore(blogContainer, display.firstChild);
} 

function deleteBlog(userEmail, imageUrl, content) {
   const user = auth.currentUser;

   if (!user) {
      alert("User not logged in. Please log in to delete the blog.");
      return;
   }

   if (user.email !== userEmail) {
      alert("You can only delete your own blogs.");
      return;
   }

   const blogRef = firebase.database().ref('blogPosts');

   // Find the blog post with matching details and remove it
   blogRef.orderByChild('userEmail').equalTo(userEmail).once('value')
      .then(snapshot => {
         snapshot.forEach(childSnapshot => {
            const blogData = childSnapshot.val();

            if (blogData.imageUrl === imageUrl && blogData.content === content) {
               // Remove the blog post from Firebase
               childSnapshot.ref.remove()
                  .then(() => {
                     alert("Blog deleted successfully!");
                     location.reload();
                  })
                  .catch(error => {
                     console.error("Error deleting blog:", error);
                     alert("Error deleting blog.");
                  });
            }
         });
      })
      .catch(error => {
         console.error("Error fetching blogs:", error);
         alert("Error deleting blog.");
      });
}
