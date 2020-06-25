

const axios = require('axios');
const nodemailer = require('nodemailer');
const {WP_CONSUMER_KEY} = require('../config/keys');
const {WP_CONSUMER_SECRET} = require('../config/keys');
const {gmailAppPassword} = require('../config/keys');

module.exports = app => {

    //This route sets the jackpot number in wordpress database.
    //It sends the post data to wordpress custom endpoint (found in the respective website child theme functions.php file)
    app.post('/api/jackpotnumber', async (req, res, next) => {
        //req.body.number is a string
        console.log(req.body.number);

        let hubResponse = 0;
        let mrgResponse = 0;

        const hubURL = 'https://miccosukee.com/wp-json/api/jackpotnumber';
        const mrgURL = 'https://mrg.miccosukee.com/wp-json/api/jackpotnumber';
        
        
        try {
            const response = await axios ({
                method: 'POST',
                url: hubURL,
                data: req.body.number, 
                headers: {
                    'Content-Type': 'text/plain'
                },
                auth: {
                    username: WP_CONSUMER_KEY,
                    password: WP_CONSUMER_SECRET
                }
            })
            if(response.data) {
                hubResponse = 1;
            }
        }
        
        catch(error) {
            res.send(error);
        }


        try {
            const response = await axios ({
                method: 'POST',
                url: mrgURL,
                data: req.body.number, 
                headers: {
                    'Content-Type': 'text/plain'
                },
                auth: {
                    username: WP_CONSUMER_KEY,
                    password: WP_CONSUMER_SECRET
                }
            })
            if(response.data) {
                mrgResponse = 1;
            }
        }
        
        catch(error) {
            res.send(error);
        }

        if(hubResponse === 1 && mrgResponse === 1){
            res.send('OK');
        } else {
            res.send('ERROR');
        }

    })



    //This route gets the current jackpot number from wordpress database.
    //It sends get to wordpress custom endpoint (found in the respective website child theme functions.php file)
    app.get('/api/getjackpotnumber', async (req, res, next) => {
      
        const hubURL = 'https://miccosukee.com/wp-json/api/getjackpotnumber';
        
        try {
            const response = await axios ({
                method: 'GET',
                url: hubURL,
                headers: {
                    'Content-Type': 'text/plain'
                },
                auth: {
                    username: WP_CONSUMER_KEY,
                    password: WP_CONSUMER_SECRET
                }
            })
            if(response.data) {
                res.send(response.data);
            }
        }
        
        catch(error) {
            res.send(error);
        }

    })


    
    //Send email of current jackpot number after number has been updated
    //https://www.w3schools.com/nodejs/nodejs_email.asp
    //https://nodemailer.com/
    app.post('/api/emailcurrentjackpot', (req, res, next) => {
        console.log(req.body);
       
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'smedia025@gmail.com',
                pass: gmailAppPassword
            }
        });

        var mailOptions = {
            from: 'smedia025@gmail.com',
            to: 'joseph.ronselli@gmail.com',
            subject: `Today's new jackpot number: ${req.body.number}`,
            html: 
                `<p>
                    Jackpot Number: ${req.body.number}</br>
                    miccosukee flush cache click <a href="https://app.getflywheel.com/josephr/miccosukee-com/advanced">HERE</a></br>
                    mrg.miccosukee flush cache click <a href="https://app.getflywheel.com/josephr/resort-gaming/advanced">HERE</a>
                </p>`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.send('Email sent.');
            }
        });
    })


}

