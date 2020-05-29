const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev');
const {dropboxKey} = require('../../config/dev');
const {dropboxSecret} = require('../../config/dev');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'temp_files_to_upload'});

/*
Observation...
problem i think is in the start and end values... 2nd call to start is hanging as if possibly the start or end value is wrong
*/


module.exports = app => {

    app.post('/api/testupload2/:file/:size', upload.single('myFile'), (req, res) => {
        console.log('begin upload process...');

        const getResponseFromBigFile = () => {

            console.log('big file function fired...');
            const CHUNK_LENGTH = 50000; //50kb
            //const CHUNK_LENGTH = 65536; //default highWaterMark
            //const CHUNK_LENGTH = 50000000; //50MB
            const FILE_SIZE = parseInt(req.params.size);
            let bytesUploaded = 0;
            let isClosed = false;
            let start = 0;
            let end = CHUNK_LENGTH - 1;
            let offset = 0;

            const continueCheck = () => {
                console.log('continue check called');
                //end
                if(bytesUploaded + CHUNK_LENGTH >= FILE_SIZE) {
                    return false;
                }
                //start or continue upload
                else {
                    return true;
                }
            }

            const setStartEnd = () => {
                console.log('startEnd called.');
                //end
                if(bytesUploaded + CHUNK_LENGTH >= FILE_SIZE) {
                    console.log('set isClosed to true');
                    start = bytesUploaded;
                    end = FILE_SIZE;
                }
                //start or continue upload
                else {
                    start = bytesUploaded;
                    end = bytesUploaded + CHUNK_LENGTH - 1;
                }
            }


            const sessionStart = async (cb) => {
                console.log('sessionStart function fired...');
                const readableStream = fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {start: 50000, end: 100000});
                const url = 'https://content.dropboxapi.com/2/files/upload_session/start';

                try { 
                    const response = await axios({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Length': bytesUploaded,
                            'Authorization': `Bearer ${dropboxAccessToken}`,
                            'Dropbox-API-Arg': JSON.stringify({
                                'close': isClosed
                            })
                        },
                        'maxContentLength': Infinity,
                        'maxBodyLength': Infinity,
                        data: readableStream
                    })
                    console.log('sessionStart result:', response.data);
                    bytesUploaded = continueCheck() ? bytesUploaded + CHUNK_LENGTH : FILE_SIZE - bytesUploaded;
                    console.log('bytes uploaded: ' + bytesUploaded);
                    setStartEnd();
                    return;
                    cb(response.data.session_id);
                }
                catch(error) {
                    console.log(error.response.data);
                }
            }

            const sessionAppend = async (sessionId, cb) => {
                console.log('sessionAppend function fired...');
                const readableStream = fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {start: start, end: end});
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
                                    //'offset': isClosed ? FILE_SIZE : bytesUploaded
                                    //'offset': CHUNK_LENGTH
                                    'offset': bytesUploaded - CHUNK_LENGTH
                                },
                                'close': isClosed
                            })
                        },
                        'maxContentLength': Infinity,
                        'maxBodyLength': Infinity,
                        data: readableStream
                    })
                    console.log('sessionAppend result:', response.data);
                    bytesUploaded = continueCheck() ? bytesUploaded + CHUNK_LENGTH : end;
                    console.log('bytes uploaded: ' + bytesUploaded);
                    setStartEnd();
                    cb();
                }
                catch(error) {
                    console.log(error.response.data);
                }
            }

            const sessionFinish = async (sessionId) => {
                const readableStream = fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {start: start, end: end});

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
                                    'offset': FILE_SIZE
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
                        data: readableStream
                    })
                console.log('sessionFinish result:', response.data);
                res.send(response.data);
                //deleteTempFile(response);
                }
                catch(error) {
                    console.log(error.response.data);
                }
            }

            
            const dowork = () => {
                
                sessionStart((sessionId) => {
                    sessionAppend(sessionId, () => { 
                        if(continueCheck() === true) {
                            dowork();
                        }
                        else {
                            console.log('calling session finish from dowork');
                            console.log(sessionId);
                            sessionFinish(sessionId);
                        }
                    })
                })
            }
            dowork();

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



























/* original code from 5/28/2020
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
*/