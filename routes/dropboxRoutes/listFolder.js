const axios = require('axios');
const {dropboxAccessToken} = require('../../config/keys')

module.exports = app => {
    //list contents of specified folder
    app.get('/api/list-content/:folder', async (req, res, next) => {
        const url = 'https://api.dropboxapi.com/2/files/list_folder';
        
        try {
            const response = await axios ({
                method: 'POST',
                url: url,
                data: {
                    'path': `/${req.params.folder}`
                    
                }, 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dropboxAccessToken}`
                }
            })
            res.send(response.data);
        }
        
        catch(error) {
            res.send(error);
        }
    })

}