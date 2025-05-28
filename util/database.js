import Database from 'better-sqlite3';

const db = new Database('./data/database.sqlite')

db.prepare(`
CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author STRING,
    title STRING,
    category STRING,
    content STRING,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`).run();

export const getAllBlogs = () => db.prepare(`SELECT * FROM blogs`).all()
export const createBlog = (author, title, category, content) =>
    db.prepare(
        `INSERT INTO blogs (author, title, category, content, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).run(author, title, category, content);

export const updateBlog = (id, author, title, category, content) =>
    db.prepare(
        `UPDATE blogs SET author = ?, title = ?, category = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(author, title, category, content, id);
export const deleteBlog = (id) => db.prepare(`DELETE FROM blogs WHERE id = ?`).run(id)

const users = [
    { id: 1, name: "Alice Smith" },
    { id: 2, name: "Bob Johnson" },
    { id: 3, name: "Charlie Brown" }
 ];


createBlog(users[0].name, "Alice's First Blog", "Tech", "Content of Alice's first blog.");
createBlog(users[0].name, "Alice's Second Blog", "Travel", "Content of Alice's second blog.");
createBlog(users[1].name, "Bob's First Blog", "Food", "Content of Bob's first blog.");
createBlog(users[1].name, "Bob's Second Blog", "Music", "Content of Bob's second blog.");
createBlog(users[2].name, "Charlie's First Blog", "Sports", "Content of Charlie's first blog.");
createBlog(users[2].name, "Charlie's Second Blog", "Art", "Content of Charlie's second blog.");