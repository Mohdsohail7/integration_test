const Bookmark = require("../models/bookmark");
const { connectDB, sequelize } = require("./init");

const seedDB = async () => {
    await connectDB();
    await sequelize.sync({ force: true });
    
    await Bookmark.bulkCreate([
        {
            url: "https://example.com",
            title: "Example",
            description: "Example is bookmark"
        },
        {
            url: "https://google.com",
            title: "Google",
            description: "Google is search engine"
        }
    ]);

    console.log("Database Seeded");
    process.exit(0); // Exit the process
};
seedDB();
