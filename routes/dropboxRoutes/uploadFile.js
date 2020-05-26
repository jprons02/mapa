const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev');
const {dropboxKey} = require('../../config/dev');
const {dropboxSecret} = require('../../config/dev');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'temp_files_to_upload'});
const stream = require('stream');

//https://github.com/adasq/dropbox-v2-api
const dropbox = require('dropbox-v2-api').authenticate({ token: dropboxAccessToken });

const Stream = require('stream');




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


        //get response for under 150MB - this is working fine.
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

            //const readStream = fs.createReadStream(`temp_files_to_upload/${req.file.filename}`);
            //const readableStream = new Stream.Readable();
            //readableStream.push(fs.createReadStream(`temp_files_to_upload/${req.file.filename}`));
            /*
            function createMockedReadStream(sign, length){
                return fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, function () {
                    return sign;
                }, length);
            }
            */
            /*
            function createMockedReadStream(sign, length){
                return tester.createRandomStream(function () {
                    return sign;
                }, length);
            }
            */
            /*
            const firstUploadChunkStream = () => fs.createReadStream(FILE_PATH, { start: 0, end: CHUNK_LENGTH - 1  }); // first 100 bytes (0 - 99) 
            const secondUploadChunkStream = () => fs.createReadStream(FILE_PATH, { start: CHUNK_LENGTH, end: 2 * CHUNK_LENGTH - 1 }); //second 100 bytes (100 - 200)
            */
           /*
            // first 100 bytes (0 - 99) 
            const firstUploadChunkStream = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, 
                { start: 0, end: CHUNK_LENGTH - 1  }); 

            //second 100 bytes (100 - 200)
            const secondUploadChunkStream = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, 
                { start: CHUNK_LENGTH, end: 2 * CHUNK_LENGTH - 1 }); 
            */

            //https://stackoverflow.com/questions/40114056/how-to-use-dropbox-upload-session-for-files-larger-than-150mb
            
            let iteration = 0;
            const FILE_SIZE = parseInt(req.params.size);
            const CHUNK_LENGTH = 100;
            let bytesConsumed = 0;
            
            
            /*
            // first 100 bytes (0 - 99) 
            const firstUploadChunkStream = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, 
                { start: 0, end: CHUNK_LENGTH - 1  }); 

            //second 100 bytes (100 - 200)
            const secondUploadChunkStream = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, 
                { 
                    //function that returns object with start and end values
                    start: CHUNK_LENGTH, 
                    end: iteration * CHUNK_LENGTH - 1 
                }); 
            */



            /*
            const uploadChunkStream = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {
                    start: iteration * CHUNK_LENGTH,
                    end: bytesConsumed + CHUNK_LENGTH - 1
                }   
            );

            const uploadChunkStream = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {
                    start: iteration * CHUNK_LENGTH,
                    end: bytesConsumed + CHUNK_LENGTH - 1
                }   
            );
            */
           
           const uploadChunkStream1 = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {
                    start: 0,
                    end: 99
                }   
            );

            const uploadChunkStream2 = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, {
                    start: 100,
                    end: 199
                }   
            );


            sessionStart((sessionId) => {
                sessionAppend(sessionId, () => {
                    sessionFinish(sessionId);
                });
            });

            function sessionStart(cb) {
                console.log('session start fired...');
                console.log('iteration: ' + iteration);
                console.log('bytes consumed: ' + bytesConsumed);
                dropbox({
                    resource: 'files/upload_session/start',
                    parameters: {
                        close: false
                    },
                    readStream: uploadChunkStream1()
                }, (err, result, response) => {
                    if (err) { return console.log('sessionStart error: ', err) }
                    
                    console.log('sessionStart result:', result);
                    iteration = iteration + 1;
                    bytesConsumed = iteration * CHUNK_LENGTH;
                    cb(result.session_id);
                });
            }


            function sessionAppend(sessionId, cb) {
                console.log('session append fired...');
                console.log('iteration: ' + iteration);
                console.log('bytes consumed: ' + bytesConsumed);
                dropbox({
                    resource: 'files/upload_session/append',
                    parameters: {
                        cursor: {
                            session_id: sessionId,
                            offset: 100 //bytesConsumed
                        },
                        close: false,
                    },
                    readStream: uploadChunkStream2()
                }, (err, result, response) => {
                    if(err){ return console.log('sessionAppend error: ', err) }
                    console.log('sessionAppend result:', result);
                    console.log(response);
                    iteration = iteration + 1;
                    bytesConsumed = iteration * CHUNK_LENGTH;
                    return ;
                    cb();
                });
            }

            function sessionFinish(sessionId) {
                console.log('session finish fired...');
                console.log('iteration: ' + iteration);
                console.log('bytes consumed: ' + bytesConsumed);
                dropbox({
                    resource: 'files/upload_session/finish',
                    parameters: {
                        cursor: {
                            session_id: sessionId,
                            offset: bytesConsumed
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