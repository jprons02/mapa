const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev')

module.exports = app => {

    //download from dropbox
    app.get('/api/download/:folder/:file', async (req, res, next) => {
        const url = 'https://content.dropboxapi.com/2/files/download';
        
        try {
            const response = await axios({
                method: 'POST',
                url: url,
                responseType: 'arraybuffer',
                params: {
                    arg: {
                        'path': `/${req.params.folder}/${req.params.file}`
                    }
                },
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Authorization': `Bearer ${dropboxAccessToken}`
                }
            });
            res.send(response.data);
        }
        
        catch(error) {
            res.send(error);
        }
        
    })

}