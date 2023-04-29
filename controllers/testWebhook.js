const request = require("request");
require("dotenv").config();
// Your verify token. Should be a random string.
let VERIFY_TOKEN = process.env['MY_VERIFY_TOKEN'];
// console.log(VERIFY_TOKEN)

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  console.log(received_message.text)
  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: ${received_message.text}. . Now send me an attachment`
    }
  }

  callSendAPI(sender_psid, response)
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  let payload = received_postback.payload;

  if (payload === 'yes') {
    response = { 'text': 'Thanks'};
  } else if (payoad === 'no') {
    response = {
      'text': 'Oops, try sending another image'
    };
  }

  callSendApi(sender_psid, response)
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": { "text": response }
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env['PAGE_ACCESS_TOKEN'] },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let test = () => {
  
}

let getWebhook = (req, res) => {
  // VERIFY TOKEN
  console.log('getwebhook')
  // let VERIFY_TOKEN = VERIFY_TOKEN;
  // console.log(VERIFY_TOKEN);
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  console.log(mode);
  console.log(token);
  console.log(challenge);

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK VERIFIED');
      res.status(200).send(challenge)
    } else {
      // Responds with 403 forbidden if verify tokens do not match
      res.sendStatus(403)
    }
  }
}

let postWebhook = (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Get the webhook event. entry.messaging is an array, but 
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log( "Sender PSID" + sender_psid);

    if (webhook_event.message) {
      handleMessage(sender_psid, webhook_event.message)
    } else if (webhook_event.postback) {
      handlePostBack(sender_psid, webhook_event.postback)
    }
      
      
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}

module.exports = {
  getWebhook: getWebhook,
  postWebhook: postWebhook
}