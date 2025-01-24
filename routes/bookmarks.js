const express = require("express");
const Bookmark = require("../models/bookmark");
const { where } = require("sequelize");
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

// route for filter data by favorite
router.get("/", async (req, res) => {
    try {
        const favorite = req.query.favorite === "true";
        console.log("favorite-->", favorite)
        const bookmarks = await Bookmark.findAll({ where: { favorite } });
        if (bookmarks.length === 0) {
            return res.status(404).json({ error: "Bookmark not found." });
        }
        return res.status(200).json({ message: "bookmarks marked as favorite", bookmarks });
    } catch (error) {
        res.status(500).json({ error: "Error fetching bookmarks." });
    }
});


// route for sort all bookmarks by title in alphabetically
router.get("/", async(req, res) => {
    try {
        const order = req.query.order;
        const bookmarks = await Bookmark.findAll({ order:[["title", order]] });
        console.log("sorted bookmarks-->", bookmarks);

        return res.status(200).json(bookmarks)
    } catch (error) {
        res.status(500).json({ error: "Error fetching bookmarks."});
    }
});

// route for filter data by favorite if not match
router.get("/", async (req, res) => {
    try {
        const favorite = req.query.favorite === "false";
        const bookmarks = await Bookmark.findAll({ where: { favorite } });
        if (!bookmarks) {
            return res.status(404).json({ error: "Bookmark not found."})
        }
        return res.status(200).json(bookmarks)
    } catch (error) {
        res.status(500).json({ error: "Error fetching bookmarks."});
    }
});

// route for Add a new bookmark
router.post("/", async (req, res) => {
    try {
        const { url, title, description } = req.body;
        if (!url) {
            return res.status(400).json({ error: "URL is required."});
        }
        if (!url.startsWith("https://" || !url.endsWith("https://")))  {
            return res.status(400).json({ error: "Invalid URL."});
        }
        const newBookmark = await Bookmark.create({ url, title, description });
        return res.status(201).json(newBookmark);

    } catch (error) {
        res.status(400).json({ error: "Invalid data provided.", details: error.message });
    }
});
// route for put
router.put("/", async (req, res) => {
    try {
        const { url, title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: "Invalid data provided."});
        }
        const newBookmark = await Bookmark.create({ url, title, description });
        return res.status(201).json(newBookmark);

    } catch (error) {
        res.status(400).json({ error: "Invalid data provided.", details: error.message });
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
        // validate
        if (favorite !== undefined && typeof favorite !== "boolean") {
            return res.status(400).json({ error: "Invalid update data."})
        }
        if (read !== undefined && typeof read !== "boolean") {
            return res.status(400).json({ error: "Invalid update data."})
        }
        if (archived !== undefined && typeof archived !== "boolean") {
            return res.status(400).json({ error: "Invalid update data."})
        }
        if (favorite !== undefined) bookmark.favorite = favorite;
        if (read !== undefined) bookmark.read = read;
        if (archived !== undefined) bookmark.archived = archived;

        await bookmark.save();
        return res.status(200).json(bookmark);

    } catch (error) {
        return res.status(500).json({ error: "Error occuerd updating data." });
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