const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Router
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const authRouter = require("./routes/auth");

// DB or MODEL
const connect = require("./schemas");
connect();
// middlewares
const errorHandler = require("./middlewares/errorHandler");

// localhost:3000/ -> indexRouter
app.use("/", [indexRouter, authRouter]);
// localhost:3000/posts -> postsRouter, commentsRouter
app.use("/posts", [postsRouter, commentsRouter]);

// middleware - errorhandler
app.use(errorHandler);
app.listen(port, () => {
  console.log(`running http://localhost:${port}`);
});
