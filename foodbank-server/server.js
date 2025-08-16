const express = require("express");
const http = require("http"); // for creating the server
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app); // create raw server for socket.io
const morgan = require("morgan");
const { readdirSync } = require("fs");
const cors = require("cors");
app.use(express.json({ limit: `100mb` }));
app.use(morgan("dev"));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

module.exports = { io };

app.use(
  cors({
    origin: true, // Allow any origin (or specify yours)
    credentials: true,
  })
);


app.options("*", cors()); // handle preflight

readdirSync("./routes").map((item) =>
  app.use("/", require("./routes/" + item))
);
const port = process.env.PORT;

// Start server
server.listen(port, "0.0.0.0", () => {
  console.log("API + Socket.IO running on port 3500");
});
