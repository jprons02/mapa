const axios = require("axios");
const {
  websecurityscanner,
} = require("googleapis/build/src/apis/websecurityscanner");
const puppeteer = require("puppeteer");
const { flywheelID, flywheelPW } = require("../../config/keys");

module.exports = (app) => {
  app.get("/api/p/flushcache", async (req, res) => {
    const websites = [
      { title: "Miccosukee.com", isCacheFlushed: false },
      { title: "Resort & Gaming", isCacheFlushed: false },
    ];

    const flywheelWebsiteSectionSelector =
      "#advanced-site-list-with-saved-filters > div > div.filter-contain > div > div.site-container";

    const loginButtonSelector =
      "#main > section > div > div.card.--mt-30 > form > div.card__footer > button";
    const flushCache = "#js-flush-cache";
    const advancedMenuSelector =
      "#main > section.--full > div > div.layout__nav > div.layout__nav-left.shadow-right > div > ul > li:nth-child(6) > a";

    //type in username/password and click login
    const loginToHosting = async (websites, fcCallback, responseCallback) => {
      for (const website of websites) {
        //headless: false will open a browser and show the automation
        try {
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();
          await page.goto("https://app.getflywheel.com/login");
          await page.type("#username", flywheelID);
          await page.type("#password", flywheelPW);
          await page.click(loginButtonSelector);

          if (websites.length - 1 === websites.indexOf(website)) {
            //this is the last item in the array, call the sendResponse funtion.
            await fcCallback(browser, page, website, responseCallback);
          } else {
            await fcCallback(browser, page, website);
          }
        } catch (err) {
          console.log("error in loginToHosting function");
          console.log(err);
          res.send(err);
        }
      }
    };

    const flushCacheProcedure = async (
      browser,
      page,
      website,
      responseCallback
    ) => {
      try {
        //wait for section to load then create website selector variables
        await page.waitForSelector(flywheelWebsiteSectionSelector);
        await page.evaluate((website) => {
          //Array.from is used to translate the Nodelist returned from querySelector to an array in order to use .find method
          const websiteElements = Array.from(document.querySelectorAll("a"));
          const websiteSelector = websiteElements.find(
            (element) => element.innerText === website.title
          );
          websiteSelector.click();
        }, website);

        //make sure "advanced" menu is loaded and click advanced
        await page.waitForSelector(advancedMenuSelector);
        await page.click(advancedMenuSelector);

        //make sure flush cache button is loaded and click it
        await page.waitForSelector(flushCache);
        await page.click(flushCache);

        //need to wait for flush cache button spinner to stop
        //loading spinner will appear when data-working attribute is set to 'true'
        //so wait for data-working === 'true' then data-working attribute to dissapear
        await page
          .waitForFunction(
            'document.getElementById("js-flush-cache").getAttribute("data-working") === "true"',
            { timeout: 0 }
          )
          .then(() =>
            console.log("data-working is true, button spinner is showing")
          );

        await page
          .waitForFunction(
            'document.getElementById("js-flush-cache").getAttribute("data-working") === null',
            { timeout: 0 }
          )
          .then(() => {
            website.isCacheFlushed = true;
          });
        await browser.close();
        //if callback argument exists, this is the last iteration - call sendResponse function
        if (responseCallback) {
          responseCallback();
        }
      } catch (err) {
        console.log("error in flushCacheProcedure funtion");
        console.log(err);
        res.send(err);
      }
    };

    const sendResponse = () => {
      if (websites[0].isCacheFlushed && websites[1].isCacheFlushed) {
        res.send("CACHE FLUSHED!");
      } else {
        res.send("ERROR: CACHE NOT FLUSHED");
      }
    };

    loginToHosting(websites, flushCacheProcedure, sendResponse);
  });
};
