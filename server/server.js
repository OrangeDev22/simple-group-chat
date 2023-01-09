require("dotenv").config();

console.log("--fe server", process.env.FE_SERVER);

const io = require("socket.io")({
  cors: {
    origin: process.env.FE_SERVER || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
}).listen(process.env.PORT || 4000);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});
