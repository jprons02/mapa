//Flow
//front end sends data to express. 
//express uses data with axios to get from dropbox. 
//express serves that response from dropbox back to front-end. 
//https://stackoverflow.com/questions/57410131/make-get-request-to-third-party-api-with-api-key-using-express-router


const axios = require('axios');
//axios.post = axios.post(url[, data[, config]])
const {dropboxAccessToken} = require('../config/dev')


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
            // handle if you got an error
            res.send(error);
            //res.send(error.response.data.error);
        }
        
    })


    //list contents of specified folder
    app.get('/api/list-content/:folder', async (req, res, next) => {
        const url = 'https://api.dropboxapi.com/2/files/list_folder';
        const data = {'path': `/${req.params.folder}`};
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${dropboxAccessToken}`
            }
        }

        try {
            const response = await axios.post(url, data, config);
            
            res.send(response.data);
        }
        catch(error) {
            // handle if you got an error
            res.send(error);
        }
    })


    //NOT WORKING
    //upload file
    app.post('/api/upload/:filename', async (req, res, next) => {
        //console.log(res.data);
        console.log(req.body);

        const uploadStartURL = 'https://content.dropboxapi.com/2/files/upload_session/start';
        const uploadAppendURL = 'https://content.dropboxapi.com/2/files/upload_session/append_v2';
        const uploadFinishedURL = 'https://content.dropboxapi.com/2/files/upload_session/finish';

        //upload start
        try {
            //a
        }
        catch(error) {
            // handle if you got an error
            res.send(error);
        }
        
    })

}
