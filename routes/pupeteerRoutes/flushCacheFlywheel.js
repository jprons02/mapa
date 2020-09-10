const axios = require("axios");
const puppeteer = require("puppeteer");
const { flywheelID, flywheelPW } = require("../../config/keys");

module.exports = (app) => {
  app.get("/api/p/flushcache", async (req, res) => {
    var isMiccosukeeCacheFlushed = false;
    var isMrgCacheFlushed = false;

    //improve this selector?... maybe innerhtml == 'miccosukee' or something like that...
    const miccosukeeSelector =
      "#advanced-site-list-with-saved-filters > div > div.filter-contain > div > div.site-container > div:nth-child(5) > div.site__inner > div.site__content > h2 > a";

    const mrgSelector =
      "#advanced-site-list-with-saved-filters > div > div.filter-contain > div > div.site-container > div:nth-child(7) > div.site__inner > div.site__content > h2 > a";

    const loginButtonSelector =
      "#main > section > div > div.card.--mt-30 > form > div.card__footer > button";
    const flushCache = "#js-flush-cache";
    const advancedMenuSelector =
      "#main > section.--full > div > div.layout__nav > div.layout__nav-left.shadow-right > div > ul > li:nth-child(6) > a";

    const websites = [miccosukeeSelector, mrgSelector];

    //type in username/password and click login
    const loginToHosting = async (websites, fcCallback, responseCallback) => {
      for (const website of websites) {
        //headless: true will open a browser and show the automation
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
        //wait for website selections to load and select miccosukee
        await page.waitForSelector(website);
        await page.click(website);

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
            if (website === miccosukeeSelector) {
              isMiccosukeeCacheFlushed = true;
              console.log(
                "isMiccosukeeCacheFlushed is set to: ",
                isMiccosukeeCacheFlushed
              );
            }
            if (website === mrgSelector) {
              isMrgCacheFlushed = true;
              console.log("isMrgCacheFlushed is set to: ", isMrgCacheFlushed);
            }
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
      if (isMiccosukeeCacheFlushed && isMrgCacheFlushed) {
        res.send("CACHE FLUSHED!");
      } else {
        res.send("ERROR: CACHE NOT FLUSHED");
      }
    };

    loginToHosting(websites, flushCacheProcedure, sendResponse);
  });
};
