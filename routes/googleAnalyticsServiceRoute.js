const privateKey = require('../google_key.json');
const {google} = require('googleapis');

module.exports = app => {
    // https://your-domain/accessTokens will return access tokens such as google access tokens
    app.get('/api/accessTokens', (req,res) => {

        // configure a JWT auth client
        let jwtClient = new google.auth.JWT(
            privateKey.client_email,
            null,
            privateKey.private_key,
            'https://www.googleapis.com/auth/analytics.readonly');
            
            jwtClient.authorize(function (err, token) {
            if (err) {
                console.log(err);
                return res.status(500).send('Error');
            } else {
                return res.send(token.access_token);
            }
        });
    })
}