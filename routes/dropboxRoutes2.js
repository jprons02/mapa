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
//-accept data in formData type format from front end 
//-then store in file path in backend
//-then send to dropbox from filepath


/*
fs.access(path[, mode], callback)
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});

*/

module.exports = app => {

    app.post('/api/testupload/:file/:size', upload.single('myFile'), async (req, res) => {

        try {
            if(req.file.filename) {
                console.log("file is downloaded? do axios stuff");
                console.log(req.file.filename);
                //console.log(req.body);
                //res.send(req.file);
                //can do crazy axios stuff now.

                //test the fs.access stuff here...

                /*
                const response = await axios({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Authorization': `Bearer ${dropboxAccessToken}`,
                        //JSON.stringify needed because dropbox api requires "Dropbox-API-Arg" value to be JSON.
                        //ref for json.stringify: https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/quot-Dropbox-API-Arg-quot-could-not-decode-input-as-JSON/td-p/288054
                        'Dropbox-API-Arg': JSON.stringify({
                            //'path': '/media/test_7.txt',
                            'path': `/media/${req.params.file}`,
                            'mode': 'add',
                            'autorename': true,
                            'mute': false,
                            'strict_conflict': false
                        })
                    },
                    //data:  '@/files/test_2.txt'//this is working for local file. filepath from where you are uploading. 
                    //data:  `@/temp_files_to_upload/${req.params.file}`
                    //data: `@/temp_files_to_upload/${req.file.filename}`
                    data: '@/temp_files_to_upload/73a068a3b8cba5ba6ade8a45444f153a'
                })
                res.send(response.data);
                */
                

            }
        }
        catch(error) {
          res.send(error);
        }

    });

}