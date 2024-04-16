// const formidable = require("formidable");
const User = require("../models/User.model");
const Conversation = require("../models/Conversation.model");
const { ObjectId } = require("mongoose").Types;
const messageModal = require("../models/Message.model");

module.exports = (io) => {
  io.on("connect", (socket) => {
    console.log("A user connected");
    socket.on("join", async (data) => {
      const { userId, conversationId } = data;
      await User.findByIdAndUpdate(userId, { socketId: socket.id });
      let conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        conversation = await Conversation.create({
          _id: ObjectId(conversationId),
        });
      }

      socket.join(conversationId);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    socket.on("leave", async (userId) => {
      await User.findByIdAndUpdate(userId, { socketId: "" });
      console.log(`User ${userId} left conversation`);
    });

    socket.on("send message", async (data) => {
      const sender = await User.findById(data.senderId);
      const receiver = await User.findById(data.receiverId);
      if (receiver && receiver.socketId) {
        if (data.type === "text") {
          await messageModal.create({
            type: data.type,
            message: data.message,
            sender: sender,
            receiver: receiver,
            conversation: data.conversationId,
            read_by: [
              {
                user: ObjectId(data.senderId),
              },
            ],
          });
          io.to(receiver.socketId).emit("send message", {
            sender: sender.name,
            message: data.message,
            type: data.type,
          });
        }
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected");
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        user.socketId = "";
        await user.save();
        console.log(`User ${user._id} disconnected`);
      }
    });
  });
};
