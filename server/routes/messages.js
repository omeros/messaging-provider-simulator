var express = require('express');
var router = express.Router();

const { messageController } = require("../controllers");


// GET  
router.get("/", (req, res) => messageController.getMessages(req, res));

// POST
router.post('/send', (req, res) => messageController.sendMessage(req, res));




module.exports = router;
