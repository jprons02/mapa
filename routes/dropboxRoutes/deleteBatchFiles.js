const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev')

module.exports = app => {
    app.post('/api/deletefiles/:files', (req, res) => {
        console.log('begin delete process');
        console.log(req.params);
    });
}