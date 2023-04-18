const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://0.0.0.0:27017/WeekOne")
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.log("mongodb connection error", err);
});

module.exports = connect;
