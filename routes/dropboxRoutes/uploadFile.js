const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev');
const {dropboxKey} = require('../../config/dev');
const {dropboxSecret} = require('../../config/dev');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'temp_files_to_upload'});
//https://github.com/adasq/dropbox-v2-api
const dropboxV2Api = require('dropbox-v2-api');

// create session ref:
const dropbox = dropboxV2Api.authenticate({
    token: 'your token'
});

// use session ref to call API, i.e.:
//set credentials
const dropbox = dropboxV2Api.authenticate({
    client_id: 'APP_KEY',
    client_secret: 'APP_SECRET',
    redirect_uri: 'REDIRECT_URI'
});
//generate and visit authorization sevice 
const authUrl = dropbox.generateAuthUrl();
//after redirection, you should receive code
dropbox.getToken(code, (err, result, response) => {
    //you are authorized now!
});

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
            const readStream = fs.createReadStream(`temp_files_to_upload/${req.file.filename}`);

            //https://stackoverflow.com/questions/40114056/how-to-use-dropbox-upload-session-for-files-larger-than-150mb
            const CHUNK_LENGTH = 100;
            //create read streams, which generates set of 100 (CHUNK_LENGTH) characters of values: 1 and 2
            const firstUploadChunkStream = () => readStream('1', CHUNK_LENGTH); 
            const secondUploadChunkStream = () => readStream('2', CHUNK_LENGTH);

            sessionStart((sessionId) => {
                sessionAppend(sessionId, () => {
                    sessionFinish(sessionId);
                });
            });

            function sessionStart(cb) {
                dropbox({
                    resource: 'files/upload_session/start',
                    parameters: {
                        close: false
                    },
                    readStream: firstUploadChunkStream()
                }, (err, response) => {
                    if (err) { return console.log('sessionStart error: ', err) }
                    console.log('sessionStart response:', response);
                    cb(response.session_id);
                });
            }


            function sessionAppend(sessionId, cb) {
                dropbox({
                    resource: 'files/upload_session/append_v2',
                    parameters: {
                        cursor: {
                            session_id: sessionId,
                            offset: CHUNK_LENGTH
                        },
                        close: false,
                    },
                    readStream: secondUploadChunkStream()
                }, (err, response) => {
                    if(err){ return console.log('sessionAppend error: ', err) }
                    console.log('sessionAppend response:', response);
                    cb();
                });
            }

            function sessionFinish(sessionId) {
                dropbox({
                    resource: 'files/upload_session/finish',
                    parameters: {
                        cursor: {
                            session_id: sessionId,
                            offset: CHUNK_LENGTH * 2
                        },
                        commit: {
                            path: `/media/${req.file.originalname}`,
                            mode: 'add',
                            autorename: true,
                            mute: false
                        }
                    }
                }, (err, response) => {
                    if (err) { return console.log('sessionFinish error: ', err) }
                    console.log('sessionFinish response:', response);
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