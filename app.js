var createError = require("http-errors");
var express = require("express");
var path = require("path");

const tasksRouter = require("./routes/index");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

function loggerMiddleware(req, res, next) {
  const now = new Date().toISOString();
  const method = req.method;
  const path = req.originalUrl;

  console.log(`[${now}] ${method} ${path}`);

  next();
}

app.use(loggerMiddleware);

app.use("/tasks", tasksRouter);

app.use(function (req, res, next) {
  res.status(404).json({ error: "Not Found" });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
