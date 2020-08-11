const axios = require("axios");
const { WP_CONSUMER_KEY, WP_CONSUMER_SECRET } = require("../../../config/keys");

module.exports = (app) => {
  //This route sets the jackpot number in wordpress database.
  //It sends the post data to wordpress custom endpoint (found in the respective website child theme functions.php file)
  app.post("/api/jackpotmonthlynumber", async (req, res, next) => {
    //req.body.number is a string
    console.log(req.body.number);

    let hubResponse = 0;
    let mrgResponse = 0;

    const hubURL = "https://miccosukee.com/wp-json/api/jackpotmonthlynumber";
    const mrgURL =
      "https://mrg.miccosukee.com/wp-json/api/jackpotmonthlynumber";

    try {
      const response = await axios({
        method: "POST",
        url: hubURL,
        data: req.body.number,
        headers: {
          "Content-Type": "text/plain",
        },
        auth: {
          username: WP_CONSUMER_KEY,
          password: WP_CONSUMER_SECRET,
        },
      });
      if (response.data) {
        hubResponse = 1;
      }
    } catch (error) {
      res.send(error);
    }

    try {
      const response = await axios({
        method: "POST",
        url: mrgURL,
        data: req.body.number,
        headers: {
          "Content-Type": "text/plain",
        },
        auth: {
          username: WP_CONSUMER_KEY,
          password: WP_CONSUMER_SECRET,
        },
      });
      if (response.data) {
        mrgResponse = 1;
      }
    } catch (error) {
      res.send(error);
    }

    if (hubResponse === 1 && mrgResponse === 1) {
      res.send("OK");
    } else {
      res.send("ERROR");
    }
  });
};
