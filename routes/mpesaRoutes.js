const express = require("express");
const router = express.Router()
const {
    MpesaToken,
    RegisterUrl,
    stkPush,
} = require("../controllers/mpesaController");

router.get('/', (req, res) => {
    res.send("Hello home")
})

//Get Access Token
router.get("/access_token", MpesaToken, (req, res) => {
    res.status(200).json({ access_token: req.token });
});

//Register URL
router.get("/register", MpesaToken, RegisterUrl, (req, res) => {
    res.status(200).json({ response_body: req.body });
});

//confirmation
router.post("/confirmation", (req, res) => {
    let mpesa_response = req.body;
    console.log(".....................confirmation.................");
    console.log(mpesa_response);
});

//validation

router.post("/validation", (req, res) => {
    let mpesa_response = req.body;
    console.log(".....................Validation.................");
    console.log(mpesa_response);
});

//STk Pusher
router.get("/stk", MpesaToken, stkPush, (req, res) => {
    res.status(200).send(body);
});

// CallBack 
router.post('/callbackurl', (req, res) => {
    console.log("..................Callback................")
    console.log(JSON.stringify(req.body.Body.stkCallback))

})

module.exports = router;