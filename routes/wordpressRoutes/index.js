const dailyJackpot = require("./jackpot/dailyJackpot");
const monthlyJackpot = require("./jackpot/monthlyJackpot");

module.exports = (app) => {
  dailyJackpot(app);
  monthlyJackpot(app);
};
