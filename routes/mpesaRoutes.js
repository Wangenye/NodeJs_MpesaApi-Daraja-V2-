const express = require("express");
const router = express.Router()
const unirest = require("unirest");
const datetime = require("node-datetime");
const {
    MpesaToken,
    RegisterUrl,
    stkPush1,
    stkPusher,
    checkStatus,
    stimulateStkPay,
    newPassword
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

//CheckStatus
router.get("/check", MpesaToken, checkStatus, (req, res) => {
    res.status(200).json({ response_body: req.body });
});

//confirmation
router.post("/confirmation", (req, res) => {
    let mpesa_response = req.body;
    console.log(".....................confirmation.................");
    // console.log(mpesa_response);
    res.status(200).json(mpesa_response)
});

//validation

router.post("/validation", (req, res) => {
    let mpesa_response = req.body;
    console.log(".....................Validation.................");
    res.status(200).json(mpesa_response);
});

//STk Pusher
router.get("/stk", MpesaToken, (req, res) => {
    const token = req.token;
    // console.log("STK token :: ", token);
    const dt = datetime.create();
    const formatedDt = dt.format("YmdHMS");

    //   const stimulateUrl = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
    unirest(
            "POST",
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        )
        .headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        })
        .send(
            JSON.stringify({
                BusinessShortCode: 174379,
                Password: newPassword(),
                Timestamp: formatedDt,
                TransactionType: "CustomerPayBillOnline",
                Amount: 1,
                PartyA: 254113877708,
                PartyB: 174379,
                PhoneNumber: 254113877708,
                CallBackURL: "https://789b-105-163-1-67.ngrok.io/api/mpesa/callbackurl",
                AccountReference: "Wangenye CompanyXLTD",
                TransactionDesc: "Payment of X",
            })
        )
        .end((error, body) => {
            if (error) {
                console.log(error);
            } else {
                res.status(200).send(body);
            }

        });
    // res.status(200).json(body.raw_body);
});
router.get("/stkst", MpesaToken, stimulateStkPay, (req, res) => {
    res.status(200).send(res.body);
});
// CallBack 
router.post('/callbackurl', (req, res) => {
    console.log("..................Callback................")
    const body = req.body
    console.log(JSON.stringify(body))

    res.status(200).send(body)

})

//REsults
router.get('/result', (req, res) => {
    console.log("..................Checking Status................")
        // console.log(JSON.stringify(req.body))
    const body = req.body
    res.status(200).json(body)
})
router.get('/queue', (req, res) => {
    console.log(JSON.stringify(req.body))
})



const amount=1
const phoneNumber=254726869778
const partyA=254726869778 
const partyB= 174379
// const token=req.token
router.get("/stkstpush", MpesaToken, stkPusher(partyA,partyB,phoneNumber,amount), (req, res) => {
    res.status(200).send(res.body);
});

module.exports = router;