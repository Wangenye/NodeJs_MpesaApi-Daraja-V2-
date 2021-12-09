const express = require('express')
require("dotenv").config()
const unirest = require("unirest")
const datetime = require("node-datetime")

//Env Keys
const passkey = process.env.MPESA_PASSKEY;
const shortcode = process.env.MPESA_SHORTCODE;
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;


//Creating password for the stkPush


const newPassword = () => {
    const dt = datetime.create();
    const formatedDt = dt.format("YmdHMS");

    const passString = shortcode + passkey + formatedDt;

    const base64EncodingPassword = Buffer.from(passString).toString("base64");

    return base64EncodingPassword;
};


//Generate Token 

exports.MpesaToken = (req, res, next) => {
    const url =
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth = new Buffer.from(consumerKey + ":" + consumerSecret).toString(
        "base64"
    );

    const access = unirest("GET", url)
        .headers({ Authorization: "Basic " + auth })
        .send()
        .end((res, body) => {
            if (res.error) {
                res.error;
            } else {
                access_token = res.body.access_token;
                // console.log(access_token);
                req.token = access_token;
                next();
            }
        });
    return access;
};

//Register URL parameters
exports.RegisterUrl = (req, res, next) => {
    console.log("AAD", req.token);

    let urlRegister = unirest(
            "POST",
            "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
        )
        .headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + req.token,
        })
        .send(
            JSON.stringify({
                ShortCode: 600996,
                ResponseType: "Completed",
                ConfirmationURL: "https://6714-102-69-228-74.ngrok.io/confirmation",
                ValidationURL: "https://6714-102-69-228-74.ngrok.io/validation",
            })
        )
        .end((res, ) => {
            if (res.error) {
                res.error;
            } else {
                response_body = res.body
                    // console.log(response_body);
                req.body = response_body;
                next();
            }

            next();
        });

    return urlRegister;
};

//STK stkPush
exports.stkPush = (req, res, next) => {
    // console.log(newPassword());
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
                CallBackURL: "https://6714-102-69-228-74.ngrok.io/callbackurl",
                AccountReference: "Wangenye CompanyXLTD",
                TransactionDesc: "Payment of X",
            })
        )
        .end((error, body) => {
            if (error) {
                console.log(error);
            }
            res.status(200).send(body)





        });

    // res.send(token)
};