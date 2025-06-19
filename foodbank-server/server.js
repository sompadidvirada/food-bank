const express = require("express");
const http = require("http"); // for creating the server
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app); // create raw server for socket.io
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const { readdirSync } = require("fs");
const cors = require("cors");

const io = new Server(server, {
  cors: {
    origin: "*", // adjust for security
    methods: ["GET", "POST"]
  }
});

app.use(express.json({ limit: `100mb` }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: true, // Allow any origin (or specify yours)
    credentials: true,
  })
);

io.on("connect", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

app.options("*", cors()); // handle preflight


const defaultImage = "public/uploads/alexandar.png";

app.get("/uploads/:imageName", (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, "public/uploads", imageName);

  const sendCachedFile = (filePath) => {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.removeHeader("Last-Modified");
    res.removeHeader("ETag");
    res.sendFile(filePath, { headers: { "Cache-Control": "public, max-age=31536000, immutable" } });
  };

  if (fs.existsSync(imagePath)) {
    sendCachedFile(imagePath);
  } else {
    sendCachedFile(path.join(__dirname, defaultImage));
  }
});

readdirSync("./routes").map((item) =>
  app.use("/", require("./routes/" + item))
);


// Start server
server.listen(3500, "0.0.0.0", () => {
  console.log("API + Socket.IO running on port 3500");
});
