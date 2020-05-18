const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'temp_files_to_upload'});


//100% have to use multer... the functions that were listening for data were firing before axios calls could resolve.
//-accept data in formData type format from frontend 
//-then store in file path in backend
//-then send to dropbox from filepath

//readable stream docs: https://nodejs.org/api/stream.html#stream_readable_streams


module.exports = app => {

    app.post('/api/testupload/:file/:size', upload.single('myFile'), (req, res) => {
        console.log('begin upload process...');

        //deletes the file uploaded to temp - called after successful upload to dropbox
        //https://stackoverflow.com/questions/5315138/node-js-remove-file
        const deleteTempFile = (response) => {
            if(response) {
                console.log('file has been successfully uploaded to dropbox...');
                console.log('deleting temp file from /temp_files_to_upload...');
                (async () => {
                    try {
                        await fs.promises.unlink(`temp_files_to_upload/${req.file.filename}`);
                    }   
                    catch(error) {
                        console.log(error);
                    }
                })();
            }
        }


        //get response for under 150MB
        const getResponse = async () => {
            const readStream = fs.createReadStream(`temp_files_to_upload/${req.file.filename}`);
            const url = 'https://content.dropboxapi.com/2/files/upload';
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Authorization': `Bearer ${dropboxAccessToken}`,
                    'Dropbox-API-Arg': JSON.stringify({
                        'path': `/media/${req.file.originalname}`,
                        'mode': 'add',
                        'autorename': true,
                        'mute': false,
                        'strict_conflict': false
                    })
                },
                //max bodylength limit error solved: https://stackoverflow.com/questions/56868023/error-request-body-larger-than-maxbodylength-limit-when-sending-base64-post-req/56868296
                'maxContentLength': Infinity,
                'maxBodyLength': Infinity,
                
                data: readStream
            })
            res.send(response.data);
            deleteTempFile(response.data);
            console.log('done.');
        }

        /*
        sessionStart((sessionId) => {
            sessionAppend(sessionId, () => {
                sessionFinish(sessionId);
            });
        });
        */


        const getResponseFromBigFile = () => {
            console.log('big file function fired...');
            const readStream = fs.createReadStream(`temp_files_to_upload/${req.file.filename}`);
            let chunkPosition = 0;
            let sessionId = '';

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
                    sessionId = response.data.session_id
                    console.log(response.data);
                }
                catch(error) {
                    res.send(error);
                }
            }

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
                    sessionId = response.data.session_id
                }
                catch(error) {
                    res.send(error);
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
                }
                catch(error) {
                    res.send(error);
                }
                
            }

            readStream.on('readable', () => {
                let maxChunkSize = 65536; //default chunk size i found from console log.
                let chunk;
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
            });

            
        }


        //testing chunk sizes and how to access chunk. needed for offset param for dropbox session append  
        const testing = () => {
            const readStream = fs.createReadStream(`temp_files_to_upload/${req.file.filename}`);
            let chunkPosition = 0;
                
            readStream.on('readable', () => {
                let maxChunkSize = 65536; //default chunk size i found from console log.
                let chunk;
                while (null !== (chunk = readStream.read())) {
                    console.log(`Received ${chunk.length} bytes of data.`);
                    chunkPosition++;
                    if(chunkPosition === 1) {
                        console.log('use session start');
                    }
                    else if(chunkPosition === 2) {
                        console.log('use session append with session start response value');
                    }
                    else if(chunkPosition >= 3 && chunk.length === maxChunkSize) {
                        console.log('use session append with session append response value');
                    }
                    else if(chunkPosition >= 3 && chunk.length < maxChunkSize) {
                        console.log('use session finish with session append response value');
                    }
                    else {
                        console.log('unexpected occured. check logic in readStream while loop.');
                    }
                }
            });
        }



        try {
            const filePath = `temp_files_to_upload/${req.file.filename}`;

            //checks if file is uploaded to temp_files_to_upload folder
            fs.access(filePath, fs.constants.F_OK, async (err) => {
                if(err) {
                    console.log('file has not been uploaded.');
                }
                //file exists, do axios call to dropbox
                else {
                    console.log('file has been uploaded to node server...');
                    getResponseFromBigFile();
                    //if file is less than 150MB
                    /*
                    if((req.params.size * .000001) < 150)  {
                        console.log('file is less than 150MB...');
                        getResponse();
                    } 
                    else {
                        console.log('file is greater or equal to 150MB...');
                        //https://stackoverflow.com/questions/40114056/how-to-use-dropbox-upload-session-for-files-larger-than-150mb
                        getResponseFromBigFile();
                    }
                    */
                }
            });
            
        }
        catch(error) {
          res.send(error);
        }

    });

}