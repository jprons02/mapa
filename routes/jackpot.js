//https://tribe.miccosukee.com/wp-json/api/numberCount
const fs = require('fs');
const axios = require('axios');
const {WP_CONSUMER_KEY} = require('../config/keys')
const {WP_CONSUMER_SECRET} = require('../config/keys')

module.exports = app => {

    //post number from front end to file, jackpotNumber.txt
    app.post('/api/tribe/jackpotnumber', async (req, res) => {
        console.log('tribe wordpress api POST...');
        //req.body.number is a string
        console.log(req.body.number);
        
        fs.writeFile('jackpotNumber.txt', req.body.number, function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
            res.send('jackpot number stored!')
        });
        
    });

    //get number from file, jackpotNumber.txt and return it to wordpress shortcode callback function
    app.get('/api/tribe/jackpot', (req, res) => {
        console.log('tribe wordpress api GET...');

        const content = fs.readFileSync('jackpotNumber.txt', 'utf8');
        console.log(content);
        res.send(content);
    });

}
