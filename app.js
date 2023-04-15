const express = require("express");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Router
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

// DB or MODEL
const connect = require("./schemas");
connect();

// localhost:3000/ -> indexRouter
app.use("/", [indexRouter]);
// localhost:3000/posts -> postsRouter, commentsRouter
app.use("/posts", [postsRouter, commentsRouter]);

app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});
