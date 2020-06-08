const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev')

module.exports = app => {
    app.post('/api/deletefiles', async (req, res) => {
        console.log('begin delete process');
        console.log(req.body);
        
        const url = 'https://api.dropboxapi.com/2/files/delete_batch';
        const dataToSend = req.body.map((file) => {
            return {
                'path': file
            }
        })
        
        try {
            const response = await axios({
                method: 'POST',
                url: url,
                responseType: 'application/json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dropboxAccessToken}`
                },
                data: JSON.stringify({
                    "entries": dataToSend
                })
            });
            res.send(response.data);
        }
        
        catch(error) {
            res.send(error.response.data);
        }

    });
}