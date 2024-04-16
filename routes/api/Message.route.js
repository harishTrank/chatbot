const checkIfConversationExists = require("../../controller/checkIfConversationExits");
const createConversation = require("../../controller/createConversation");
const getMessagesByRoomId = require("../../controller/messages/getMessages");

const router = require("express").Router();

router.get("/conversationExists", checkIfConversationExists);
router.post("/conversation", createConversation);
router.get("/all", getMessagesByRoomId);

module.exports = router;
