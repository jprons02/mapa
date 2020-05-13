//Flow
//front end sends data to express. 
//express uses data with axios to get from dropbox. 
//express serves that response from dropbox back to front-end. 
//https://stackoverflow.com/questions/57410131/make-get-request-to-third-party-api-with-api-key-using-express-router

const axios = require('axios');
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
            res.send(error);
        }
        
    })



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



    //upload file < 150MB
    //https://stackoverflow.com/questions/40114056/how-to-use-dropbox-upload-session-for-files-larger-than-150mb
    app.post('/api/upload/:file/:size', (req, res, next) => {

        const url = 'https://content.dropboxapi.com/2/files/upload';
        console.log(req.params.file);
        console.log(req.params.size);
        
        //req.on listens for streamed data from client and pushes it all into "data" variable
        //req.on help tutorials: https://spin.atomicobject.com/2015/10/03/remote-pfs-node-js-express/
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', async () => {
            data = Buffer.concat(data);
            //data variable is done being created, call axios to send to dropbox api.
            try {
                const response = await axios({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Authorization': `Bearer ${dropboxAccessToken}`,
                        //JSON.stringify needed because dropbox api requires "Dropbox-API-Arg" value to be JSON.
                        //ref for json.stringify: https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/quot-Dropbox-API-Arg-quot-could-not-decode-input-as-JSON/td-p/288054
                        'Dropbox-API-Arg': JSON.stringify({
                            //'path': '/media/test_7.txt',
                            'path': `/media/${req.params.file}`,
                            'mode': 'add',
                            'autorename': true,
                            'mute': false,
                            'strict_conflict': false
                        })
                    },
                    //data:  '@/files/test_2.txt'//this is working for local file. filepath from where you are uploading. 
                    data: data
                })
                res.send(response.data);
            }
            catch(error) {
                res.send(error.response.data);
            }
        })
        
    })

}
