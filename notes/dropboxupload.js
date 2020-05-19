const getResponseFromBigFile = () => {
    console.log('big file function fired...');
    const readStream = fs.createReadStream(`temp_files_to_upload/${req.file.filename}`);
    let chunkPosition = 0;

    //5-19 - https://stackoverflow.com/questions/45876514/async-function-await-not-waiting-for-promise
    //return new Promise((resolve, reject) => {

    /*
    function scaryClown() {
        return new Promise(resolve => {
            setTimeout(() => {
            resolve('🤡');
            }, 2000);
        });
    }

    async function msg() {
        const msg = await scaryClown();
        console.log('Message:', msg);
    }

    msg(); // Message: 🤡 <-- after 2 seconds
    */
    const sessionStart = (chunk) => {
        console.log('sessionStart function fired...');
        const url = 'https://content.dropboxapi.com/2/files/upload_session/start';
        
        return axios({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                    'Dropbox-API-Arg': JSON.stringify({
                        'close': false
                    })
                },
                data: chunk
            })
        
    }

    /*
    const sessionStart = async (chunk) => {
        console.log('sessionStart function fired...');
        const url = 'https://content.dropboxapi.com/2/files/upload_session/start';
        try {
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                    'Dropbox-API-Arg': JSON.stringify({
                        'close': false
                    })
                },
                data: chunk
            })
            console.log(response.data);
            return response.data;
            
        }
        catch(error) {
            //console.log(error);
        }
    }
    */
    /*
    const sessionStart = async (chunk, cb) => {
        console.log('sessionStart function fired...');
        const url = 'https://content.dropboxapi.com/2/files/upload_session/start';
        try {
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                    'Dropbox-API-Arg': JSON.stringify({
                        'close': false
                    })
                },
                data: chunk
            })
            console.log(response.data);
            return response.data;
            
        }
        catch(error) {
            //console.log(error);
        }
    }
    */

    const sessionAppend = async (chunk, sessionId) => {
        console.log('sessionAppend function fired...');
        const url = 'https://content.dropboxapi.com/2/files/upload_session/append_v2';
        try { 
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                    'Dropbox-API-Arg': JSON.stringify({
                        'cursor': {
                            'session_id': sessionId,
                            'offset': chunk.length
                        },
                        'close': false
                    })
                },
                data: chunk
            })
            /*
            if(response.data) {
                //sessionId = response.data.session_id;
                //console.log('sessionAppend sessionId: ' + sessionId);
            }
            */
            return response.data;

        }
        catch(error) {
            //console.log(error);
        }
    }

    const sessionFinish = async (chunk, sessionId) => {
        console.log('sessionFinish function fired...');
        const url = 'https://content.dropboxapi.com/2/files/upload_session/finish';
        try {
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                    'Dropbox-API-Arg': JSON.stringify({
                        'cursor': {
                            'session_id': sessionId,
                            'offset': chunk.length
                        },
                        'commit': {
                            'path': `/media/${req.file.originalname}`,
                            'mode': 'add',
                            'autorename': true,
                            'mute': false,
                            'strict_conflict': false
                        }
                    })
                },
                data: chunk
            })
        res.send(response.data);
        deleteTempFile(response.data);
        console.log('done.');
        return response.data;
        }
        catch(error) {
            res.send(error.response.data);
        }
        
    }

    //5-19 - https://stackoverflow.com/questions/39110762/while-loops-using-await-async

    readStream.on('readable', () => {
        let maxChunkSize = 65536; //default chunk size i found from console log.
        
        //might have to change this to for loop: https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
        //while (null !== (chunk = readStream.read())) { }

        /*
        async function processArray(array) {
            for (const item of array) {
                await delayedLog(item);
            }
            console.log('Done!');
        }
        */
        
        const sessionResponse = async () => {
            let sessionId = '';
            //console.log(readStream.read());
            while (readStream.read() !== null) {
                console.log(readStream.read().length);
            }
            /*
            for(const chunk of readStream.read()) {
                console.log(`Received ${chunk.length} bytes of data.`);
                chunkPosition++;

                if(chunkPosition === 1) {
                    console.log('use session start');
                    response = await sessionStart(chunk);
                    sessionId = response.session_id;
                }
                else if(chunkPosition >= 2 && chunk.length === maxChunkSize) {
                    console.log('use session append');
                    response = await sessionAppend(chunk, sessionId);
                    console.log(response);
                    sessionId = response.session_id;
                }
                else if(chunkPosition >= 3 && chunk.length < maxChunkSize) {
                    console.log('use session finish');
                    response = await sessionFinish(chunk, sessionId);
                    console.log(response);
                    sessionId = response.session_id;
                }
            }
            */
        }
        sessionResponse();
        

        /*
        while (null !== (chunk = readStream.read())) {
            console.log(`Received ${chunk.length} bytes of data.`);
            console.log(sessionId);
            chunkPosition++;

            if(chunkPosition === 1) {
                console.log('use session start');
                sessionStart(chunk);
            }
            else if(chunkPosition === 2) {
                console.log('use session append with session start response value');
                sessionAppend(chunk, sessionId);
            }
            else if(chunkPosition >= 3 && chunk.length === maxChunkSize) {
                console.log('use session append with session append response value');
                sessionAppend(chunk, sessionId);
            }
            else if(chunkPosition >= 3 && chunk.length < maxChunkSize) {
                console.log('use session finish with session append response value');
                sessionFinish(chunk, sessionId);
            }
            else {
                console.log('unexpected occured. check logic in readStream while loop.');
            }
        }
        */
        
    });

    
}