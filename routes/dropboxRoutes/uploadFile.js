const axios = require('axios');
const {dropboxAccessToken} = require('../../config/dev');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'temp_files_to_upload'});


//100% have to use multer... the functions that were listening for data were firing before axios calls could resolve.
//-accept data in formData type format from frontend 
//-then store in file path in backend
//-then send to dropbox from filepath


module.exports = app => {

    app.post('/api/testupload/:file/:size', upload.single('myFile'), (req, res) => {


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
                    catch (e) {
                        console.log(e);
                    }
                })();
            }
        }


        //get response for under 150MB
        const getResponse = async () => {
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
                //createReadStream to process binary
                data: fs.createReadStream(`temp_files_to_upload/${req.file.filename}`)
            })
            res.send(response.data);
            deleteTempFile(response.data);
            console.log('done.');
        }


        const getResponseFromBigFile = () => {
            console.log('big file function fired...');
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
                    //if file is less than 150MB
                    if((req.params.size * .000001) < 150)  {
                        console.log('file is less than 150MB...');
                        getResponse();
                    } 
                    else {
                        console.log('file is greater or equal to 150MB...');
                        //https://stackoverflow.com/questions/40114056/how-to-use-dropbox-upload-session-for-files-larger-than-150mb
                    }
                }
            });
            
        }
        catch(error) {
          res.send(error);
        }

    });

}