import express from 'express';
import * as db from './util/database.js';
import cors from 'cors';


const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/blogs", (req, res) => {
    try {
        const blogs = db.getAllBlogs();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.post("/blogs", (req, res) => {
    try {
        const { author, content, category, title } = req.body;
        if (!author || !content || !category || !title) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const created_at = new Date().toISOString();
        const updated_at = created_at;
        const savedBlog = db.createBlog(author, content, category, title, created_at, updated_at);
        if (savedBlog.changes != 1) {
            return res.status(422).json({ message: "Unprocessable Entity" });
        }
        res.status(201).json({ 
            id: savedBlog.lastInsertRowid, 
            author, 
            content, 
            category, 
            title, 
            created_at, 
            updated_at 
        });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.put("/blogs/:id", (req, res) => {
    try {
        const { author, content, category, title } = req.body;
        if (!author || !content || !category || !title) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const id = req.params.id;
        const updated_at = new Date().toISOString();
        const updatedBlog = db.updateBlog(id, author, content, category, title, updated_at);
        if (updatedBlog.changes != 1) {
            return res.status(422).json({ message: "Unprocessable Entity" });
        }
        res.status(200).json({ id, author, content, category, title, updated_at });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.delete("/blogs/:id", (req, res) => {
    try {
        const deletedBlog = db.deleteBlog(req.params.id);
        if (deletedBlog.changes != 1) {
            return res.status(422).json({ message: "Unprocessable Entity" });
        }
        res.status(200).json({ message: "Delete successful" });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));