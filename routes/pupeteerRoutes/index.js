const flushCacheFlywheel = require("./flushCacheFlywheel");

//module.exports = (app, io) => {
module.exports = (app) => {
  flushCacheFlywheel(app);
};
