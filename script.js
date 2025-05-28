const API_URL = "http://localhost:3000/blogs";

async function fetchBlogs() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const tbody = document.querySelector("#blogs tbody");

    const users = [
        { id: 1, name: "Alice Smith" },
        { id: 2, name: "Bob Johnson" },
        { id: 3, name: "Charlie Brown" }
    ];
    
    const dropdown = document.getElementById("author");
    if (dropdown.children.length === 0) {
        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user.name;
            option.textContent = user.name;
            dropdown.appendChild(option);
        });
    }

    tbody.innerHTML = "";
    data.forEach(blog => {
        const { id, author, title, category, content, created_at, updated_at } = blog;
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${id}</td>
            <td>${author}</td>
            <td>${title}</td>
            <td>${category}</td>
            <td>${content}</td>
            <td>${created_at ? new Date(created_at).toLocaleString() : "N/A"}</td>
            <td>${updated_at ? new Date(updated_at).toLocaleString() : "N/A"}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button onclick="deleteBlog(${id})">Delete</button>
            </td>
        `;

        tr.querySelector(".edit-btn").addEventListener("click", () => {
            populateFormForUpdate(blog);
        });

        tbody.appendChild(tr);
    });
}
    function populateFormForUpdate(blog) {
        document.getElementById("blogId").value = blog.id;
        document.getElementById("author").value = blog.author;
        document.getElementById("title").value = blog.title;
        document.getElementById("category").value = blog.category;
        document.getElementById("content").value = blog.content;
    
        const button = document.querySelector("#addBlogForm button");
        button.textContent = "Update Blog";
    }    

async function updateBlog(id) {
    const author = prompt("Enter new author:");
    const title = prompt("Enter new title:");
    const category = prompt("Enter new category:");
    const content = prompt("Enter new content:");
    if (author && title && category && content) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ author, title, category, content })
        });
        fetchBlogs();
    }
}
async function deleteBlog(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchBlogs();
}

document.querySelector("#addBlogForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const blogId = document.getElementById("blogId").value;
    const author = document.getElementById("author").value;
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value;

    const blogData = { author, title, category, content };

    if (blogId) {
        await fetch(`${API_URL}/${blogId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blogData)
        });
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blogData)
        });
    }

    e.target.reset();
    document.getElementById("blogId").value = "";
    document.querySelector("#addBlogForm button").textContent = "Post Blog";
    fetchBlogs();
});
document.addEventListener("DOMContentLoaded", fetchBlogs);