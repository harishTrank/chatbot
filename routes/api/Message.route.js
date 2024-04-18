const checkIfConversationExists = require("../../controller/checkIfConversationExits");
const createConversation = require("../../controller/createConversation");
const getMessagesByRoomId = require("../../controller/messages/getMessages");
const getConversationList = require("../../controller/messages/getConversationList");
const getCurrentMessage = require("../../controller/messages/getCurrentMessage");
const createChatGroup = require("../../controller/messages/createChatGroup");

const router = require("express").Router();

router.get("/conversationExists", checkIfConversationExists);
router.post("/conversation", createConversation);
router.get("/", getMessagesByRoomId);
router.get("/current", getCurrentMessage);
router.get("/conversation", getConversationList);
router.post("/creategroup", createChatGroup);

module.exports = router;
