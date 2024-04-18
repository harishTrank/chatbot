const User = require("../models/User.model");
const Conversation = require("../models/Conversation.model");
const { ObjectId } = require("mongoose").Types;
const messageModal = require("../models/Message.model");

module.exports = (io) => {
  io.on("connect", (socket) => {
    console.log("A user connected");

    socket.on("save socketid", async (data) => {
      await User.findByIdAndUpdate(data.userId, { socketId: socket.id });
    });

    socket.on("conversation list", async (data) => {
      const conversations = await Conversation.aggregate([
        {
          $match: {
            members: ObjectId(data.userId),
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "members",
            foreignField: "_id",
            as: "membersInfo",
          },
        },
      ]);
      socket.emit("conversation list", conversations);
    });

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

    socket.on("leave", async (data) => {
      await User.findByIdAndUpdate(data.userId, { socketId: "" });
    });

    socket.on("heartbeat", async (data) => {
      console.log("heartbeat");
      if (data.userId) {
        await User.findOneAndUpdate(
          {
            socketId: socket.id,
          },
          {
            status: "online",
          },
          {
            new: true,
          }
        );
      }
    });

    socket.on("send message", async (data) => {
      const sender = await User.findById(data.senderId);
      const receivers = await User.find({ _id: { $in: data.receiverIds } });
      if (data.type === "text") {
        const latestMessage = await messageModal.create({
          type: data.type,
          message: data.message,
          sender: sender,
          receivers: receivers,
          conversation: data.conversationId,
          read_by: {
            user: ObjectId(data.senderId),
          },
        });
        receivers.forEach((receiver) => {
          io.to(receiver.socketId).emit("send message", {
            sender: sender.name,
            message: data.message,
            latestMessageId: latestMessage?._id,
            type: data.type,
          });
        });
      }
    });

    socket.on("disconnect", async (data) => {
      console.log("User disconnected");
      await User.findOneAndUpdate(
        {
          socketId: socket.id,
        },
        {
          status: "offline",
          socketId: "",
        },
        {
          new: true,
        }
      );
    });
  });
};
