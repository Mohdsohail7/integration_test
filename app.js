const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/init");

const bookmarksRoutes = require("./routes/bookmarks");

const app = express();
app.use(cors());
app.use(express.json());

// connect to database
connectDB();

// Routes
app.use("/bookmarks", bookmarksRoutes)


module.exports = { app }