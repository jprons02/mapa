//Flow
//front end sends data to express. 
//express uses data with axios to get from dropbox. 
//express serves that response from dropbox back to front-end. 
//https://stackoverflow.com/questions/57410131/make-get-request-to-third-party-api-with-api-key-using-express-router

const downloadFile = require('./downloadFile');
const uploadFile = require('./uploadFile');
const listFolder = require('./listFolder');
const testingdropbox = require('./testingdropboxUpload');
const deleteBatchFiles = require('./deleteBatchFiles');

//module.exports = (app, io) => {
module.exports = (app) => {
    downloadFile(app);
    //uploadFile(app, io);
    uploadFile(app);
    listFolder(app);
    testingdropbox(app);
    deleteBatchFiles(app);
}
