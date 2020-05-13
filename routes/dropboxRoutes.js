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

        
        //if((req.params.size * .000001) > 150)
        
        //1MB = 0.000001 bytes. size is in bytes. so take "size" and multiply by .000001.
        
        //req.on listens for streamed data from client and pushes it all into "data" variable
        //req.on help tutorials: https://spin.atomicobject.com/2015/10/03/remote-pfs-node-js-express/
        
        let number = 0;
        let sessionIDs = [];
        req.on('data', async chunk => {
            //need to wait for response to finish before sending data... we might need multer for real now...
            //or build array of session ids?
            try {
                const iterator = () => {
                    number = number + 1;
                    console.log(number);
                }
                iterator();
                
                const getAxiosConfig = () => {
                    if(number === 1) {
                        return {
                            url: 'https://content.dropboxapi.com/2/files/upload_session/start',
                            headers: {
                                'Content-Type': 'application/octet-stream',
                                'Authorization': `Bearer ${dropboxAccessToken}`,
                                //JSON.stringify needed because dropbox api requires "Dropbox-API-Arg" value to be JSON.
                                //ref for json.stringify: https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/quot-Dropbox-API-Arg-quot-could-not-decode-input-as-JSON/td-p/288054
                                'Dropbox-API-Arg': JSON.stringify({
                                    'close': false
                                })
                            }
                        }
                    } else if(number > 1) {
                        return {
                            url: 'https://content.dropboxapi.com/2/files/upload_session/append_v2',
                            headers: {
                                'Content-Type': 'application/octet-stream',
                                'Authorization': `Bearer ${dropboxAccessToken}`,
                                //JSON.stringify needed because dropbox api requires "Dropbox-API-Arg" value to be JSON.
                                //ref for json.stringify: https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/quot-Dropbox-API-Arg-quot-could-not-decode-input-as-JSON/td-p/288054
                                DropboxAPIArg: JSON.stringify({
                                    'cursor': {
                                        'session_id': sessionIDs[(number - 1)],
                                        'offset': 0
                                    },
                                    'close': false
                                })
                            }
                        }
                    }
                }
                console.log(getAxiosConfig().url);
                console.log(getAxiosConfig().DropboxAPIArg);
                
                const response = await axios({
                    method: 'POST',
                    url: getAxiosConfig().url,
                    headers: getAxiosConfig.headers,
                    //data:  '@/files/test_2.txt'//this is working for local file. filepath from where you are uploading. 
                    data: chunk
                })
                //console.log(response.data.session_id);
                sessionIDs.push(response.data.session_id);
                
            }
            catch(error) {
                res.send(error);
            }
        });
        req.on('end', () => {
            console.log("all data has been passed to axios");
        })
        
    })

}















/*this was working for very small files... ran into memory issue.
//upload file < 150MB
    //https://stackoverflow.com/questions/40114056/how-to-use-dropbox-upload-session-for-files-larger-than-150mb
    app.post('/api/upload/:file/:size', (req, res, next) => {

        

        
        //1MB = 0.000001 bytes. size is in bytes. so take "size" and multiply by .000001.
        
        //req.on listens for streamed data from client and pushes it all into "data" variable
        //req.on help tutorials: https://spin.atomicobject.com/2015/10/03/remote-pfs-node-js-express/
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', async () => {
            data = Buffer.concat(data);
            console.log(data);
            //data variable is done being created, call axios to send to dropbox api.
            try {
                //if file is greater than 150MB
                if((req.params.size * .000001) > 150) {
                    console.log("file is greater than 150MB, do something else");
                    
                    const url = 'https://content.dropboxapi.com/2/files/upload_session/start';
                    const response = await axios({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Authorization': `Bearer ${dropboxAccessToken}`,
                            //JSON.stringify needed because dropbox api requires "Dropbox-API-Arg" value to be JSON.
                            //ref for json.stringify: https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/quot-Dropbox-API-Arg-quot-could-not-decode-input-as-JSON/td-p/288054
                            'Dropbox-API-Arg': JSON.stringify({
                                'close': false
                            })
                        },
                        //data:  '@/files/test_2.txt'//this is working for local file. filepath from where you are uploading. 
                        data: data
                    })
                    console.log(response.data);
                    return;
                }

                //this is working.
                //if file is 150MB or less
                else {
                    const url = 'https://content.dropboxapi.com/2/files/upload';
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
                        //data:  `@/temp_files_to_upload/${req.params.file}`
                        data: data
                    })
                    res.send(response.data);
                }
            }
            catch(error) {
                res.send(error);
            }
        })
        
    })
*/