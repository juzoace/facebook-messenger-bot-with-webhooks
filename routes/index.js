var express = require('express');
var router = express.Router();
// const { postWebhook, getWebhook} = require("../controllers/webhooks");

// const { postWebhook, getWebhook} = require("../controllers/testWebhook");
const { postWebhook, getWebhook} = require("../controllers/webhooks");

router.get("/webhook", getWebhook);
router.post("/webhook", postWebhook);
router.get("/", (req, res) => {
  res.send('Welcome to facebook messengerS bot')
})

module.exports = router;
