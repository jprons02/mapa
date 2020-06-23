//This route sets the jackpot number in wordpress database.
//It sends the post data to wordpress custom endpoint (found in the respective website child theme functions.php file)

const axios = require('axios');
const {WP_CONSUMER_KEY} = require('../config/keys');
const {WP_CONSUMER_SECRET} = require('../config/keys');

module.exports = app => {

    //list contents of specified folder
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


}






    /*
    //post number from front end to file, jackpotNumber.txt
    app.post('/api/jackpotnumber', async (req, res) => {
        console.log('wordpress api POST...');
        //req.body.number is a string
        console.log(req.body.number);
        
        fs.writeFile('jackpotNumber.txt', req.body.number, function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
            res.send('jackpot number stored!')
        });
        
    });

    //get number from file, jackpotNumber.txt and return it to wordpress shortcode callback function
    app.get('/api/jackpot', (req, res) => {
        console.log('wordpress api GET...');

        const content = fs.readFileSync('jackpotNumber.txt', 'utf8');
        console.log(content);
        res.send(content);
    });
    */

