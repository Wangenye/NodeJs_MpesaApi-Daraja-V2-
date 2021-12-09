const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const MpesaRoutes = require("./routes/mpesaRoutes")
var colors = require('colors');


const app = express();
app.use(bodyParser.json());

//Routes for Payments

app.use('/api/mpesa', MpesaRoutes)


//listen
const Port = process.env.PORT || process.env.LOCAL_PORT
app.listen(Port, (err, listener) => {
    if (!err) {
        console.log(`Local Server Connected on Port ${Port}`.cyan.underline.italic.bold);
    } else {
        console.log(`Error Running Local Server ::${err}::`.red.underline.bold);
    }
});