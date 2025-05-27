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
     users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.name;
        option.textContent = user.name;
        dropdown.appendChild(option);
        });

    tbody.innerHTML = ""; 
    data.forEach(row => {
        const id = row.id || "N/A";
        const author = row.author || "Unknown";
        const title = row.title || "Untitled";
        const category = row.category || "Unknown";
        const content = row.content || "Unknown";
        const created_at = row.created_at ? new Date(row.created_at).toLocaleString() : "N/A";
        const updated_at = row.updated_at ? new Date(row.updated_at).toLocaleString() : "N/A";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${id}</td>
            <td>${author}</td>
            <td>${title}</td>
            <td>${category}</td>
            <td>${content}</td>
            <td>${created_at}</td>
            <td>${updated_at}</td>
            <td>
                <a onclick="updateBlog(${id})">Update</a>
                <a onclick="deleteBlog(${id})">Delete</a>
        `;
        tbody.appendChild(tr);
    });
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
    const author = document.querySelector("#author").value;
    const title = document.querySelector("#title").value;
    const category = document.querySelector("#category").value;
    const content = document.querySelector("#content").value;
    if (!author || !title || !category || !content) {
        alert("All fields are required!");
        return;
    }
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, title, category, content })
    });
    fetchBlogs();
});
document.addEventListener("DOMContentLoaded", () => {
    fetchBlogs();
});