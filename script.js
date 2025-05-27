document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();

  const blogForm = document.getElementById("blogForm");

  // Form submit event to create a new blog post
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value;

    const postData = { title, author, category, content };
    try {
      const res = await fetch("/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const newPost = await res.json();
      if (res.status === 201) {
        alert("Blog poszt sikeresen létrehozva!");
        fetchPosts();
        blogForm.reset();
      } else {
        alert("Hiba történt: " + newPost.message);
      }
    } catch (error) {
      alert("Hiba történt: " + error);
    }
  });
});

// Fetch all blog posts
async function fetchPosts() {
  try {
    const res = await fetch("/blogs");
    const posts = await res.json();

    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = ""; // Reset posts

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p><strong>Szerző:</strong> ${post.author}</p>
        <p><strong>Kategória:</strong> ${post.category}</p>
        <p>${post.content}</p>
        <p><small><strong>Created at:</strong> ${post.created_at}</small></p>
        <button onclick="editPost(${post.id})">Szerkesztés</button>
        <button onclick="deletePost(${post.id})">Törlés</button>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Hiba történt a posztok lekérdezésekor:", error);
  }
}

// Edit post function
async function editPost(id) {
  const title = prompt("Új cím:");
  const author = prompt("Új szerző:");
  const category = prompt("Új kategória:");
  const content = prompt("Új tartalom:");

  const updatedData = { title, author, category, content };

  try {
    const res = await fetch(`/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const updatedPost = await res.json();
    if (res.status === 200) {
      alert("Poszt sikeresen frissítve!");
      fetchPosts();
    } else {
      alert("Hiba történt a poszt frissítésekor.");
    }
  } catch (error) {
    alert("Hiba történt: " + error);
  }
}

// Delete post function
async function deletePost(id) {
  if (confirm("Biztosan törlöd ezt a posztot?")) {
    try {
      const res = await fetch(`/blogs/${id}`, {
        method: "DELETE",
      });

      const response = await res.json();
      if (res.status === 200) {
        alert(response.message);
        fetchPosts();
      } else {
        alert("Hiba történt a poszt törlésénél.");
      }
    } catch (error) {
      alert("Hiba történt: " + error);
    }
  }
}
