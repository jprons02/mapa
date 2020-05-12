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



    //upload file
    //https://stackoverflow.com/questions/40114056/how-to-use-dropbox-upload-session-for-files-larger-than-150mb
    app.post('/api/upload', async (req, res, next) => {

        const url = 'https://content.dropboxapi.com/2/files/upload';
        
        //https://spin.atomicobject.com/2015/10/03/remote-pfs-node-js-express/
        //if i can pass data variable to data in axios call, i might have it done.
        //https://nodejs.org/fr/docs/guides/anatomy-of-an-http-transaction/
        //echo server?
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', () => {
            data = Buffer.concat(data);
            console.log(data);
        })
        
        
        
        try {
        
        //need a better way to wait for data to populate. if statement not good.
        if(data !== []) {    
            

            //////////////
            // output the headers
            /*
            console.log(req.headers);

            // capture the encoded form data
            req.on('data', (data) => {
                console.log(data.toString());
            });

            // send a response when finished reading
            // the encoded form data
            req.on('end', () => {
                res.send('ok');
            });
            */
            /////////////////
            
            
            
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                    //JSON.stringify needed because Dropbox-API-Arg value has to be JSON.
                    //ref for json.stringify: 
                    //https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/quot-Dropbox-API-Arg-quot-could-not-decode-input-as-JSON/td-p/288054
                    'Dropbox-API-Arg': JSON.stringify({
                        'path': '/media/test_7.txt',
                        'mode': 'add',
                        'autorename': true,
                        'mute': false,
                        'strict_conflict': false
                    })
                },
                //this is working:
                //data:  '@/files/test_2.txt'//filepath from where you are uploading.
                
                //testing: 
                data: data.data //this variable needs to wait for req.on('data')
            })
            res.send(response.data);

        }
            
        }
        
        catch(error) {
            // handle if you got an error
            res.send(error.response.data);
        }
        
    })

}
