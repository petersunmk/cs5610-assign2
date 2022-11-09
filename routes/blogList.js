const express = require("express");
const router = express.Router();
const Blog = require("../dbSchema");
const { body, validationResult } = require("express-validator");

//Create new blog
router.get("/new", (req, res) => {
  res.render("new", { blog: new Blog() });
});
// Edit blog
router.get("/:slug/edit", async (req, res) => {
  try {
    // const blog = await Blog.findById(req.params.id);
    const blog = await Blog.findOne({ slug: req.params.slug });

    res.render("edit", { blog: blog });
  } catch {
    // a proper 404 error handler
    res.status(404).send({ error: "Blog is not found!" });
  }
});

//update data
router.post("/:slug/edit", async (req, res) => {
  // console.log("test go or not");

  await Blog.updateOne(
    { slug: req.params.slug },
    { $set: req.body },
    { upsert: true }
  );
  // console.log(blog.upsertedId);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // let blog = new Blog({
  //   title: req.body.title,
  //   content: req.body.content,
  // });
  // res.redirect(`/${blog.slug}`);
  else {
    res.redirect(`/${req.params.slug}`);
  }
  // else res.render("edit", { blog: blog });
});

//save the blog
router.post("/", async (req, res) => {
  // add express validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let blog = new Blog({
    title: req.body.title,
    content: req.body.content,
  });
  try {
    blog = await blog.save();
    res.redirect(`/${blog.slug}`);
  } catch (e) {
    res.render("new", { blog: blog });
  }
});

//Show the blog

router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (blog == null) {
      // console.log("not founud");
      res.redirect("/");
    }
    // res.send(req.params.id);
    else res.render("show", { blog: blog });
  } catch {
    // a proper 404 error handler
    res.status(404).send({ error: "Blog is not found!" });
  }
});

// Delete the blog

router.get("/:slug/delete-task", async (req, res) => {
  await Blog.deleteOne({ slug: req.params.slug });
  res.redirect("/");
});

module.exports = router;
