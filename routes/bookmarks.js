const express = require("express");
const Bookmark = require("../models/bookmark");
const router = express.Router();

// route for Get All bookmarks
router.get("/", async (req, res) => {
    try {
        const bookmarks = await Bookmark.findAll();
        res.status(200).json(bookmarks);

    } catch (error) {
        res.status(500).json({ error: "Error fetching bookmarks."});
    }
});

// route for Add a new bookmark
router.post("/", async (req, res) => {
    try {
        const { url, title, description } = req.body;
        const newBookmark = await Bookmark.create({ url, title, description });
        res.status(201).json(newBookmark);

    } catch (error) {
        res.status(400).json({ error: "Invalid data provided."});
    }
});

// route for Update bookmark or (mark as favorite, read and archived)
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { favorite, read, archived } = req.body;
        const bookmark = await Bookmark.findByPk(id);
        if (!bookmark) {
            return res.status(404).json({ error: "Bookmark not found"});
        }
        if (favorite !== undefined) bookmark.favorite = favorite;
        if (read !== undefined) bookmark.read = read;
        if (archived !== undefined) bookmark.archived = archived;

        await bookmark.save();
        res.status(200).json(bookmark);

    } catch (error) {
        res.status(400).json({ error: "Invalid update data provided" });
    }
});

// route for Delete a bookmark
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const bookmark = await Bookmark.findByPk(id);

        if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });

        await bookmark.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error deleting bookmark" });
    }
});

module.exports = router;