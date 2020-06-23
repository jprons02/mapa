//This route gets the current jackpot number from wordpress database.
//It sends get to wordpress custom endpoint (found in the respective website child theme functions.php file)

const axios = require('axios');
const {WP_CONSUMER_KEY} = require('../config/keys');
const {WP_CONSUMER_SECRET} = require('../config/keys');

module.exports = app => {

    //list contents of specified folder
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


}