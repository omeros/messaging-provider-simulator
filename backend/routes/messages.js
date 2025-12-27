var express = require('express');
var router = express.Router();

const MessageController  = require ('../controllers/messageController')


// GET  
router.get("/", (req, res) => MessageController.getMessages(req, res));

// POST
router.post('/send', (req, res) => MessageController.sendMessage(req, res));




module.exports = router;
