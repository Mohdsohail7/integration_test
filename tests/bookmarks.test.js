const request = require("supertest");
const {app} = require("../app");
const { sequelize } = require("../db/init");
const Bookmark = require("../models/bookmark");

beforeAll(async () => {
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
        },
    ]);
});

afterAll(async () => {
    await sequelize.close();
});

describe("Bookmarkly App API Tests", () => {
    it("should get all bookmarks", async() => {
        const response = await request(app).get("/bookmarks");
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toBe(2);
    });

    it("Return 200 OK with an empty array when no bookmarks exist", async() => {
        const response = await request(app).get("/bookmarks");
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            message: "Bookmarks retrieved successfully",
            bookmarks: []
        });
    });

    it("should get all favorite bookmarks", async() => {
        const response = await request(app).get("/bookmarks?favorite=true");
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual("bookmarks marked as favorite");
    });

    it("should return 200 if filter no match", async() => {
        const response = await request(app).get("/bookmarks?favorite=false");
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([]);
    });

    it("should create a new bookmark ", async() => {
        const response = await request(app).post("/bookmarks").send({
            url: "https://github.com",
            title: "Github",
            description: "new code repositry"
        });
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.url).toBe("https://github.com");
    });

    it("should Return 400 if URL is missing in POST request ", async() => {
        const response = await request(app).post("/bookmarks").send({
            title: "Github",
            description: "new code repositry"
        });
        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toEqual("URL is required.");
    });

    it("should Return 400 if URL is invalid in POST request ", async() => {
        const response = await request(app).post("/bookmarks").send({
            url: "http://github.com",
            title: "Github",
            description: "new code repositry"
        });
        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toEqual("Invalid URL.");
    });

    it("should Return 400 if required fields are missing in PUT request ", async() => {
        const response = await request(app).put("/bookmarks").send({
            url: "http://github.com",
            description: "new code repositry"
        });
        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toEqual("Invalid data provided.");
    });

    it("should update a bookmark as favorite", async () => {
        const response = await request(app).patch("/bookmarks/1").send({ favorite: true });
        expect(response.statusCode).toEqual(200);
        expect(response.body.favorite).toBe(true);
    });

    it("should return 404 if bookmark not found patch request", async() => {
        const response = await request(app).patch("/bookmarks/5").send({ favorite: true });
        expect(response.statusCode).toEqual(404);
        expect(response.body.error).toEqual("Bookmark not found")
    });

    it("should return 400 if invalid data", async() => {
        const response = await request(app).patch("/bookmarks/1").send({ favorite: "asd" });
        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toEqual("Invalid update data.");
    });


    it("should delete a bookmark", async() => {
        const response = await request(app).delete("/bookmarks/2");
        expect(response.statusCode).toEqual(204);
    });

    it("should return 404 if bookmark not found", async() => {
        const response = await request(app).delete("/bookmarks/4");
        expect(response.statusCode).toEqual(404);
        expect(response.body.error).toEqual("Bookmark not found")
    });

})