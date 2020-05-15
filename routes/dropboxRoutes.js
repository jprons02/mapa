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


    //5/14 the function pattern i might need is in example url below:
    //https://stackoverflow.com/questions/40114056/how-to-use-dropbox-upload-session-for-files-larger-than-150mb
    app.post('/api/upload/:file/:size', (req, res, next) => {

        

        
        //req.on listens for streamed data from client and pushes it all into "data" variable
        //req.on help tutorials: https://spin.atomicobject.com/2015/10/03/remote-pfs-node-js-express/
        
        let number = 0;
        let sessionID = '';

        const fileSize = req.params.size;
        let byteCount = 0; //use for dropbox "offset" value
        const chunkSize = 100000;
        const maxBytes = 10000000000; //10GBs
        let response = {};

        const getResponse = async (url, headers, chunks, sessionId, offset, finalChunk, callback) => {
            try{
                console.log('getResponse() fired.');
                const response = await axios({
                    method: 'POST',
                    url: url,
                    headers: headers,
                    data: Buffer.concat(chunks)
                })
                console.log(response.data.session_id);
                if(finalChunk) {res.send(response.data)};
                return response.data.session_id; //this should be session_id object if session upload url is used.
            }
            catch(error) {
                console.log(error.response.data);
            }
            //return response.data;
            //can not use res.send functions... will lead to multiple header error... res.send(response.data);
        }
        
        //small files under 100kb
        if(fileSize < chunkSize) {
            const url = 'https://content.dropboxapi.com/2/files/upload';
            const headers = {
                'Content-Type': 'application/octet-stream',
                'Authorization': `Bearer ${dropboxAccessToken}`,
                //JSON.stringify needed because dropbox api requires "Dropbox-API-Arg" value to be JSON.
                //ref for json.stringify: https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/quot-Dropbox-API-Arg-quot-could-not-decode-input-as-JSON/td-p/288054
                'Dropbox-API-Arg': JSON.stringify({
                    'path': `/media/${req.params.file}`,
                    'mode': 'add',
                    'autorename': true,
                    'mute': false,
                    'strict_conflict': false
                })
            }

            let chunks = [];
            let finalChunk = false;
            req.on('readable', function () {
                let data;
                while(true) {
                    data = this.read(chunkSize);
                    if (!data) { break; }
    
                    byteCount += data.byteLength;
                    if (byteCount > maxBytes) {
                        console.log("error, upload exceededs 10GBs.")
                    break;
                    }

                    chunks.push(data);
                    if(data.byteLength < chunkSize) {
                        console.log("this is last chunk");
                        finalChunk = true;
                    }
                }
                getResponse(url, headers, chunks, null, null, finalChunk);
                //url, headers, chunks, sessionId, offset, finalChunk, callback
            });

            req.on('end', () => {
                console.log("done accepting data");
            })
        }
        
        
        else {
            
            let headers = {};
            let offset = 0;
            let chunks = [];
            let finalChunk = false;
            let url = '';
            let sessionId = null;
            const sessionFlag = () => {
                //session start
                if(offset === 0) {
                    return 'start';
                } 
                //append session
                else if(offset !== 0 && finalChunk === false) {
                    return 'append';
                }
                //finish session
                else if(offset !== 0 && finalChunk === true) {
                    return 'finish'
                } 
            }

            req.on('readable', function () {
                let data;
                
                while(true) {
                    data = this.read(chunkSize);
                    if (!data) { break; }
    
                    byteCount += data.byteLength;
                    offset = byteCount;

                    if (byteCount > maxBytes) {
                        console.log('error, upload exceededs 10GBs.')
                    break;
                    }

                    chunks.push(data);
                    if(data.byteLength < chunkSize) {
                        console.log('this is last chunk');
                        finalChunk = true;
                    }
                }

                if(sessionFlag() === 'start') {
                    console.log('session start flag');
                    console.log('offset number: ' + offset);
                    url = 'https://content.dropboxapi.com/2/files/upload_session/start';
                    headers = {
                        'Content-Type': 'application/octet-stream',
                        'Authorization': `Bearer ${dropboxAccessToken}`,
                        'Dropbox-API-Arg': JSON.stringify({'close': false})
                    };
                    sessionId = getResponse(url, headers, chunks, sessionId, offset, finalChunk);
                    
                } 
                else if(sessionFlag() === 'append') {
                    console.log('session append flag');
                    console.log('offset number: ' + offset);
                    url = 'https://content.dropboxapi.com/2/files/upload_session/append_v2';
                    headers = {
                        'Content-Type': 'application/octet-stream',
                        'Authorization': `Bearer ${dropboxAccessToken}`,
                        'Dropbox-API-Arg': JSON.stringify({
                            'cursor': {
                                'session_id': sessionId,
                                'offset': offset //this is how much data has been sent so far
                            },
                            'close': false
                        })
                    };
                    sessionId = getResponse(url, headers, chunks, sessionId, offset, finalChunk);
                }
                else if(sessionFlag() === 'finish') {
                    console.log('session finish flag');
                    console.log('offset number: ' + offset);
                    url = 'https://content.dropboxapi.com/2/files/upload_session/finish';
                    headers = {
                        'Content-Type': 'application/octet-stream',
                        'Authorization': `Bearer ${dropboxAccessToken}`,
                        'Dropbox-API-Arg': JSON.stringify({
                            'cursor': {
                                'session_id': sessionId,
                                'offset': offset //this is how much data has been sent so far
                            },
                            'commit': { 
                                'path': `/media/${req.params.file}`,
                                'mode': 'add',
                                'autorename': true,
                                'mute': false,
                                'strict_conflict': false
                            }
                        })
                    };
                    sessionId = getResponse(url, headers, chunks, sessionId, offset, finalChunk);
                }

            });

            req.on('end', () => {
                console.log('done accepting data');
            })
        }
        
        

        /*
        req.on('readable', function () {
            let chunks = [];
            let data;
            
            while(true) {
                data = this.read(chunkSize);
                if (!data) { break; }

                byteCount += data.byteLength;
                if (byteCount > maxBytes) {
                    console.log("error, upload exceededs 10GBs.")
                break;
                }
                
                chunks.push(data);
                console.log(byteCount);
                if(data.byteLength < chunkSize) {
                    console.log("call the finished function after push final chunk.");
                }
            }
            
            

            //if byteCount <= 100000, url_start //does not solve problem for small files.
            //if data.byteLength < chunkSize, url_finished
            //else url_prepend

        // do something with chunks like the axios call?

        });
        */




        /*
        req.on('data', chunk => {
            
            try {
                const iterator = () => number = number + 1;
                iterator();

                let url = '';
                let headers = {}
                let offset = 0;

                if(number === 1) {
                    url = 'https://content.dropboxapi.com/2/files/upload_session/start';
                    headers = {
                        'Content-Type': 'application/octet-stream',
                        'Authorization': `Bearer ${dropboxAccessToken}`,
                        'Dropbox-API-Arg': JSON.stringify({'close': false})
                    };
                } 
                else if(number > 1) {
                    url = '';
                    headers = {
                        'Content-Type': 'application/octet-stream',
                        'Authorization': `Bearer ${dropboxAccessToken}`,
                        'Dropbox-API-Arg': JSON.stringify({
                            'cursor': {
                                'session_id': sessionIDs['session_id'],
                                'offset': offset //this is how much data has been sent so far
                            },
                            'close': false
                        })
                    };
                    
                }
                console.log(url);
                console.log(headers);
                getAxiosResponse(chunk, url, headers);

                const getAxiosResponse = async (dataChunk, url, headers) => {
                    try {
                        const response = await axios({
                        method: 'POST',
                        url: url,
                        headers: headers,
                        //data:  '@/files/test_2.txt'//this is working for local file. filepath from where you are uploading. 
                        data: dataChunk
                        })
                        console.log(response.data);
                        sessionIDs.push(response);
                    }
                    catch(error) {
                        res.send(error);
                    }
                }
                //need callback from getAxiosResponse to resolve?
                
            }
            catch(error) {
                res.send(error);
            }
            
        });
        */
        /*
        req.on('end', () => {
            console.log("all data has been passed to axios");
            console.log(byteCount);
        })
        */
        
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