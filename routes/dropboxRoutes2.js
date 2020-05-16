//Flow
//front end sends data to express. 
//express uses data with axios to get from dropbox. 
//express serves that response from dropbox back to front-end. 
//https://stackoverflow.com/questions/57410131/make-get-request-to-third-party-api-with-api-key-using-express-router

const axios = require('axios');
const {dropboxAccessToken} = require('../config/dev');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'temp_files_to_upload'});


//100% have to use multer... the functions that were listening for data were firing before axios calls could resolve.
//-accept data in formData type format from frontend 
//-then store in file path in backend
//-then send to dropbox from filepath


module.exports = app => {

    app.post('/api/testupload/:file/:size', upload.single('myFile'), (req, res) => {

        try {
            const filePath = `temp_files_to_upload/${req.file.filename}`;

            //checks if file is uploaded to temp_files_to_upload folder
            fs.access(filePath, fs.constants.F_OK, async (err) => {
                console.log(`${filePath} ${err ? 'does not exist' : 'exists'}`);
                if(err) {
                    console.log('file has not been uploaded');
                }
                //file exists, do axios call to dropbox
                else {
                    console.log('file has been uploaded.');
                    console.log(req.file);
                    
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
                        data: fs.createReadStream(`temp_files_to_upload/${req.file.filename}`)
                    })
                    res.send(response.data);

                    //deletes file from temp_files_to_upload upon successful upload to dropbox.
                    //https://stackoverflow.com/questions/5315138/node-js-remove-file
                    if(response.data) {
                        console.log('destroy temp file that is now in dropbox.');
                        (async () => {
                            try {
                              await fs.promises.unlink(`temp_files_to_upload/${req.file.filename}`);
                            } catch (e) {
                              console.log(e);
                            }
                        })();
                    }
                }
            });
            
        }
        catch(error) {
          res.send(error);
        }

    });

}