const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'temp_files_to_upload'});

//https://github.com/adasq/dropbox-v2-api
/*
const dropboxV2Api = require('dropbox-v2-api');
const path = require('path');
const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
const dropbox = dropboxV2Api.authenticate({
    token: credentials.TOKEN
});
*/
const dropbox = require('dropbox-v2-api').authenticate({ token: dropboxAccessToken });





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


        const getResponseFromBigFile = () => {
            const CHUNK_LENGTH = 100000;
            const FILE_SIZE = parseInt(req.params.size);
            let bytesUploaded = 0;
            let isClosed = false;
            
            /*
            const uploadChunkStream = () => {
                console.log('uploadChunk called');
                let start;
                let end;

                //end
                if((bytesUploaded + CHUNK_LENGTH) >= FILE_SIZE) {
                    start = bytesUploaded;
                    end = FILE_SIZE;
                } 
                //start or continue upload
                else {
                    start = bytesUploaded;
                    end = bytesUploaded + CHUNK_LENGTH - 1;
                }
                
                console.log('start value: ' + start);
                console.log('end value: ' + end);
                
                return fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {start: start, end: end});
            }
            */
           
            let start;
            let end;
            const uploadChunkStream = () => {
                console.log('uploadChunk called');
                console.log('start value: ' + start);
                console.log('end value: ' + end);
                
                return fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {start: start, end: end});
            }

            const dowork = () => {
                //end
                if(bytesUploaded + CHUNK_LENGTH >= FILE_SIZE) {
                    console.log('set isClosed to true');
                    isClosed = true;
                    start = bytesUploaded;
                    end = FILE_SIZE;
                }
                //start or continue upload
                else {
                    start = bytesUploaded;
                    end = bytesUploaded + CHUNK_LENGTH - 1;
                }

                sessionStart((sessionId) => {
                    console.log('calling session append from dowork');
                    console.log('this is the sessionId to be passed to append: ' + sessionId);
                    sessionAppend(sessionId, () => {
                        if(bytesUploaded + CHUNK_LENGTH >= FILE_SIZE) {
                            console.log('calling session finish from dowork');
                            sessionFinish(sessionId);
                        }
                        else {
                            dowork();
                        }
                    })
                })
            }
            dowork();

            function sessionStart(cb) {
                console.log('sessionStart() called.');
                try {
                    dropbox({
                        resource: 'files/upload_session/start',
                        parameters: {
                            close: false
                        },
                        readStream: uploadChunkStream()
                    }, (err, result, response) => {
                        if (err) { return console.log('sessionStart error: ', err) }
                        console.log('sessionStart result:', result);
                        
                        bytesUploaded = bytesUploaded + CHUNK_LENGTH;
                        console.log('bytes uploaded: ' + bytesUploaded);
                        cb(result.session_id);
                    });
                }
                catch(error) {
                    console.log(error);
                }
            }
            
            
            function sessionAppend(sessionId, cb) {
                console.log('sessionAppend() called.');
                try {
                    dropbox({
                        resource: 'files/upload_session/append',
                        parameters: {
                            cursor: {
                                session_id: sessionId,
                                //offset = UInt64 The amount of data that has been uploaded so far. We use this to make sure upload data isn't lost or duplicated in the event of a network error.
                                //offset: bytesUploaded
                                offset: bytesUploaded
                            },
                            close: isClosed,
                        },
                        readStream: uploadChunkStream()
                    }, (err, result, response) => {
                        if(err){ return console.log('sessionAppend error: ', err) }
                        bytesUploaded = bytesUploaded + CHUNK_LENGTH;
                        console.log('sessionAppend result:', result);
                        cb();
                        
                    });
                }
                catch(error) {
                    console.log(error);
                }

            }
            
            function sessionFinish(sessionId) {
                console.log('sessionFinish() called.');
                dropbox({
                    resource: 'files/upload_session/finish',
                    parameters: {
                        cursor: {
                            session_id: sessionId,
                            offset: bytesUploaded
                            
                        },
                        commit: {
                            path: `/media/${req.file.originalname}`,
                            mode: 'add',
                            autorename: true,
                            mute: false
                        }
                    }
                }, (err, result, response) => {
                    if (err) { return console.log('sessionFinish error: ', err) }
                    console.log('sessionFinish result:', result);
                    res.send(result);
                    deleteTempFile(result);
                });
            }


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
                    getResponse();
                    //getResponseFromBigFile();
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