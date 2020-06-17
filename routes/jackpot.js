//https://tribe.miccosukee.com/wp-json/api/numberCount
const axios = require('axios');
const {WP_CONSUMER_KEY} = require('../config/keys')
const {WP_CONSUMER_SECRET} = require('../config/keys')

module.exports = app => {
    app.post('/api/tribe/jackpot/:number', async (req, res) => {
        console.log('tribe wordpress api post...');

        const url = 'https://tribe.miccosukee.com/wp-json/api/numberCount';
        console.log('params number is this: ', req.params.number);
        console.log(typeof req.params.number);

        try {
            const response = await axios({
                method: 'POST',
                auth: {
                    username: WP_CONSUMER_KEY,
                    password: WP_CONSUMER_SECRET
                },
                url: url,
                responseType: 'application/json',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    'number': req.params.number
                })
            });
            console.log(response.data);
            res.send(response.data);
        }
        
        catch(error) {
            console.log(error);
            res.send(error);
        }

    });
}