const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev');
const {dropboxKey} = require('../../config/dev');
const {dropboxSecret} = require('../../config/dev');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'temp_files_to_upload'});

const util = require('util');
const dropbox = require('dropbox-v2-api').authenticate({ token: dropboxAccessToken });

module.exports = app => {

    app.post('/api/testupload/:file/:size', upload.single('myFile'), (req, res) => {
        console.log('begin upload process...');
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


        const getResponseFromBigFile = () => {
            const CHUNK_LENGTH = 100;

            const firstUploadChunkStream = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, { start: 0, end: CHUNK_LENGTH - 1  }); // first 100 bytes (0 - 99)
            const secondUploadChunkStream = () => fs.createReadStream(`temp_files_to_upload/${req.file.filename}`, { start: CHUNK_LENGTH, end: 2 * CHUNK_LENGTH - 1 }); //second 100 bytes (100 - 200)

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
                }, (err, result, response) => {
                    if (err) { return console.log('sessionStart error: ', err) }
                    console.log('sessionStart result:', result);
                    cb(result.session_id);
                });
            }


            function sessionAppend(sessionId, cb) {
                dropbox({
                    resource: 'files/upload_session/append',
                    parameters: {
                        cursor: {
                            session_id: sessionId,
                            offset: CHUNK_LENGTH
                        },
                        close: false,
                    },
                    readStream: secondUploadChunkStream()
                }, (err, result, response) => {
                    if(err){ return console.log('sessionAppend error: ', err) }
                    console.log('sessionAppend result:', result);
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
                            path: "/result.txt",
                            mode: "add",
                            autorename: true,
                            mute: false
                        }
                    }
                }, (err, result, response) => {
                    if (err) { return console.log('sessionFinish error: ', err) }
                    console.log('sessionFinish result:', result);
                });
                res.send(result);
            }


        }


        try {
            const filePath = `temp_files_to_upload/${req.file.filename}`;

            //checks if file is uploaded to temp_files_to_upload folder
            fs.access(filePath, fs.constants.F_OK, async (err) => {
                if(err) {
                    console.log('file has not been uploaded.');
                }
                //file exists, do dropbox call
                else {
                    console.log('file has been uploaded to node server...');
                    getResponseFromBigFile();
                }
            });
            res.send('nice');
            
            
        }
        catch(error) {
            res.send(error);
        }

    });

}