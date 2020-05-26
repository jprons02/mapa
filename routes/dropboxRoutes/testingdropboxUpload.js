const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev');
const {dropboxKey} = require('../../config/dev');
const {dropboxSecret} = require('../../config/dev');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'temp_files_to_upload'});

module.exports = app => {

    app.post('/api/testupload2/:file/:size', upload.single('myFile'), (req, res) => {
        console.log('begin upload process...');

        const getResponseFromBigFile = () => {
            console.log('big file function fired...');
            let sessionId = '';
            let iteration = 0;
            const FILE_SIZE = parseInt(req.params.size);
            const CHUNK_LENGTH = 50000;
            let bytesConsumed = 0;
            
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
                        'maxContentLength': Infinity,
                        'maxBodyLength': Infinity,
                        data: chunk
                    })
                    sessionId = response.data.session_id;
                    console.log(sessionId);
                    iteration = iteration + 1;
                    console.log(iteration);
                    bytesConsumed = iteration * CHUNK_LENGTH;
                    console.log(bytesConsumed);
                }
                catch(error) {
                    console.log(error);
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
                                    'offset': bytesConsumed
                                },
                                'close': false
                            })
                        },
                        'maxContentLength': Infinity,
                        'maxBodyLength': Infinity,
                        data: chunk
                    })
                    iteration = iteration + 1;
                    console.log(iteration);
                    bytesConsumed = (bytesConsumed + CHUNK_LENGTH) >= FILE_SIZE ? FILE_SIZE - bytesConsumed : iteration * CHUNK_LENGTH;
                    console.log(bytesConsumed);
                }
                catch(error) {
                    console.log(error);
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
                                    'offset': bytesConsumed
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
                        'maxContentLength': Infinity,
                        'maxBodyLength': Infinity,
                        data: chunk
                    })
                res.send(response.data);
                deleteTempFile(response.data);
                console.log('done.');
                sessionId = response.data.session_id;
                }
                catch(error) {
                    res.send(error.response.data);
                }
                
            }


            const uploadChunkStream = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {
                    start: iteration * CHUNK_LENGTH,
                    //if end chunk is greater than the data that is left... end = total file size - amount of data consumed
                    //else, end = bytes consumed so far * iteration + standard chunk - 1
                    end: CHUNK_LENGTH >= (FILE_SIZE - bytesConsumed) ? FILE_SIZE : bytesConsumed * iteration + CHUNK_LENGTH - 1
                }   
            );
            
            const dowork = async () => {
                console.log('dowork() fired.');
                await sessionStart(uploadChunkStream(), sessionId);
                console.log('dowork() sessionStart was called');
                await sessionAppend(uploadChunkStream(), sessionId)
                if(bytesConsumed < FILE_SIZE) {
                    dowork();
                } 
                else {
                    await sessionFinish(uploadChunkStream(), sessionId);
                    console.log('dowork() sessionFinish was called');
                }
            }
            dowork();
            //while(bytesConsumed < FILE_SIZE)

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
                }
            });
            
        }
        catch(error) {
          res.send(error);
        }

    })
}