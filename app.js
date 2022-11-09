require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const blogRouter = require("./routes/blogList");
const Blog = require("./dbSchema");
const port = 3000;
const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  // const blogs = [
  //   {
  //     title: "test blog",
  //     createDate: new Date(),
  //     content: "test content",
  //   },
  //   {
  //     title: "test blog 2",
  //     createDate: new Date(),
  //     content: "test content 2",
  //   },
  // ];
  try {
    const blogs = await Blog.find().sort({ createDate: "desc" });
    res.render("index", { blogs: blogs });
  } catch {
    // a proper 404 error handler
    res.status(404).send({ error: "Blog is not found!" });
  }
});

app.use("/", blogRouter);

app.listen(port, () => {
  console.log(`application is listening on port ${port}`);
  mongoose.connect(process.env.mongodb_uri);
});
