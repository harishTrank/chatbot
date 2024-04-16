const Message = require("../../models/Message.model");
const Conversation = require("../../models/Conversation.model");
const { ObjectId } = require("mongoose").Types;

/**
 *  Get messages for a group with pagination
 * @param {String} groupId - chat room id
 * @param {Number} startIndex - index from where to start search
 * @param {Number} viewSize - limit size of query
 */
const saveMessage = async ({
  conversationId,
  type,
  message,
  sender,
  referenceId,
  read_by,
  postMessage,
}) => {
  try {
    const conversationExists = await Conversation.findOne({
      _id: conversationId,
    });
    if (!conversationExists) throw new Error("Conversation Id is bad");
    if (!conversationExists.members.includes(sender))
      throw new Error("You are not a part of this conversation");
    console.log("==============================================", postMessage);
    const messages = new Message({
      type,
      message,
      sender,
      conversation: conversationId,
      deleted_by: [],
      read_by,
      reference_id: referenceId,
    });
    if (postMessage) messages.postMessage = ObjectId(message);
    await messages.save();
    const messageResponse = {
      message: messages?.message,
      type: messages?.type,
      created_at: messages?.created_at,
      read_by: messages?.read_by,
      _id: messages?._id,
      reference_id: messages?.reference_id,
      sender: {
        _id: messages?.sender,
      },
    };
    conversationExists.hidden_by = [];
    conversationExists.last_message = messages._id;
    await conversationExists.save();
    return { message: messageResponse, conversation: conversationExists };
  } catch (err) {
    console.log("err in save message: ", err);
    return err;
  }
};

module.exports = saveMessage;
