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

io.use((socket, next) => {
  const token = socket.handshake.auth.token; // from client auth
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    socket.user = decoded; // store user info for later use
    next(); // allow connection
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

app.options("*", cors()); // handle preflight

readdirSync("./routes").map((item) =>
  app.use("/", require("./routes/" + item))
);
const port = process.env.PORT;

// Start server
server.listen(port, "0.0.0.0", () => {
  console.log("API + Socket.IO running on port 3500");
});
