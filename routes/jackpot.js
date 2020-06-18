//https://tribe.miccosukee.com/wp-json/api/numberCount
const fs = require('fs');
const axios = require('axios');
const {WP_CONSUMER_KEY} = require('../config/keys')
const {WP_CONSUMER_SECRET} = require('../config/keys')

module.exports = app => {

    //post number from front end to file, jackpotNumber.txt
    app.post('/api/tribe/jackpotnumber', async (req, res) => {
        console.log('tribe wordpress api POST...');
        console.log(req.body);
        
        const data = JSON.stringify(req.body);
        
        fs.writeFile('jackpotNumber.json', data, function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
            res.send('jackpot number stored!')
        });

    });

    //get number from file, jackpotNumber.txt and return it to wordpress shortcode callback function
    app.get('/api/tribe/jackpot', async (req, res) => {
        console.log('tribe wordpress api GET...');

        try {
            fs.readFile('jackpotNumber.json', function(err, data) {
                if (err) throw err;
                console.log(data);
                res.send(data);
            });
        }
        catch(error) {
            res.send(error)
        }
    });

}
