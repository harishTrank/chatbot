const checkIfConversationExists = require("../../controller/checkIfConversationExits");
const createConversation = require("../../controller/createConversation");
const getMessagesByRoomId = require("../../controller/messages/getMessages");
const getConversationList = require("../../controller/messages/getConversationList");
const getCurrentMessage = require("../../controller/messages/getCurrentMessage");
const createChatGroup = require("../../controller/messages/createChatGroup");
const softDeleteMessage = require("../../controller/messages/softDeleteMessage");
const checkGroupAdmin = require("../../controller/messages/checkGroupAdmin");
const editGroupConversation = require("../../controller/messages/editGroupConversation");
const deleteGroup = require("../../controller/messages/deleteGroup");

const router = require("express").Router();

router.get("/conversationExists", checkIfConversationExists);
router.post("/conversation", createConversation);
router.get("/", getMessagesByRoomId);
router.get("/current", getCurrentMessage);
router.get("/conversation", getConversationList);
router.post("/creategroup", createChatGroup);
router.delete("/softdelete", softDeleteMessage);
router.get("/checkadmin", checkGroupAdmin);
router.put("/editgroup", editGroupConversation);
router.delete("/deletegroup", deleteGroup);

module.exports = router;
