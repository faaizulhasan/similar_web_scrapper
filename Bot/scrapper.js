class Scrapper {

    constructor() {
        this.config = require("./Config/config.json");
    }

    async initPuppeter() {
        const puppeteer = require('puppeteer');
        const fs = require("fs");

        this.browser = await puppeteer.launch({
            headless: false,
            args: this.config.puppeteerSettings,
            ignoreHTTPSErrors: true,
            userDataDir: './userdata',
            dumpio: true,
            slowMo: 250, // slow down by 250ms
            devtools: true
        });

        this.page = await this.browser.newPage();
        const preloadFile = fs.readFileSync('./preload.js', 'utf8');
        await this.page.evaluateOnNewDocument(preloadFile);
        this.page.setViewport({width: 1700, height: 1080});
        //set the language to english
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'en'
        });
    }

    async visitWebsite() {
        await this.page.goto(this.config.url);
        await this.page.waitFor(5000);
        /*await this.page.click(this.config.selectors.click_search_field);
        await this.page.waitFor(1000);
        await this.page.keyboard.type(this.config.search_company);
        await this.page.waitFor(3000);
        await this.page.click(this.config.selectors.select_first_website);
        await this.page.waitForNavigation();*/
    }

    async searchCompany() {
        await this.page.click(this.config.selectors.click_to_search_field);
        await this.page.keyboard.type(this.config.search_company);
        await this.page.waitFor(2000);
        await this.page.click(this.config.selectors.select_domain_type_menu);
        await this.page.waitFor(1000);
        await this.page.click(this.config.selectors.select_domain_type);
        await this.page.click(this.config.selectors.select_domain_type_domain);
        await this.page.click(this.config.selectors.click_search_button);
        await this.page.waitForNavigation();
        await this.page.waitFor(5000);
    }


    async getInfo() {
        let webisteData = await this.page.evaluate(() => {
            debugger;
            let data = [];
            // let aHrefRank = document.querySelector();
            // let urlRating = document.querySelector(this.config.selectors.get_url_rating);
            /*let domainRating = document.querySelector(this.config.selectors.get_domain_rating);
            let backLinks = document.querySelector(this.config.selectors.get_backlinks);
            let backLinksPastDays = document.querySelector(this.config.selectors.get_backlinks_past_days);
            let referringDomains = document.querySelector(this.config.selectors.get_referring_domains);
            let organicKeywords = document.querySelector(this.config.selectors.get_organic_keywords);
            let organicKeywordsPastDays = document.querySelector(this.config.selectors.get_organic_keywords_past_days);
            let organicTraffic = document.querySelector(this.config.selectors.get_organic_traffic);
            let organicTrafficPastDays = document.querySelector(this.config.selectors.get_organic_traffic_past_days);
            let trafficValue = document.querySelector(this.config.selectors.get_traffic_value);*/

            // data.push({'Ahrefs Rank: ': aHrefRank ? aHrefRank.innerText : 'N/A'});
            // data.push({'Url Rating: ': urlRating ? urlRating.innerText : 'N/A'});
            /*data.push({'Domain Rating: ': domainRating ? domainRating.innerText : 'N/A'});
            data.push({'BackLinks: ': backLinks ? backLinks.innerText : 'N/A'});
            data.push({'BackLinks Last 7 Days: ': backLinksPastDays ? backLinksPastDays.innerText : 'N/A'});
            data.push({'Referreing Domains: ': referringDomains ? referringDomains.innerText : 'N/A'});
            data.push({'Referreing Domains Last 7 Days: ': organicKeywordsPastDays ? organicKeywordsPastDays.innerText : 'N/A'});
            data.push({'Organic Traffic: ': organicTraffic ? organicTraffic.innerText : 'N/A'});
            data.push({'Organic Traffic Past 7 Days: ': organicTrafficPastDays ? organicTrafficPastDays.innerText : 'N/A'});
            data.push({'Traffic Value: ': trafficValue ? trafficValue.innerText : 'N/A'});*/
            return data
        },);
        console.dir(webisteData);

    }

    async closeBrowser() {
        await this.browser.close();
    }
}

module.exports = Scrapper;

/*const puppeteer = require('puppeteer');

let url = 'https://ahrefs.com';*/

/*
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setViewport({width: 1100, height: 768});
    await page.goto(url);
    await page.waitFor(2500);
    await page.click(".iubenda-cs-close-btn");
    await page.click(".btn-header-login a");
    await page.waitFor(1000);
    await page.click("input[type=\"email\"]");
    await page.keyboard.type('raza.abeer25@gmail.com');

    await page.click("input[type=\"password\"]");
    await page.keyboard.type('Cydo@1234');
    await page.click('#SignInButton');
    await page.waitForNavigation();
    await page.click('.css-blzthy-input.css-1y92zrp-clearableInput.css-i6dz57-sm.css-j3q2yv-input');
    await page.keyboard.type('slack.com');
    await page.waitFor(2000);
    await page.click('.css-1drvj8m-dropdownItem');
    await page.waitFor(1000);
    await page.click('button.btn.btn--default.dropdown-toggle.css-nzp1c7');
    await page.click('.css-1cs1g1b-dropdown.dropdown.show .dropdown-menu .dropdown-item:nth-child(3)');
    await page.click('.btn.btn--primary.default.css-184i2sh-button');
    await page.waitForNavigation();
    await page.waitFor(5000);
    let webisteData = await page.evaluate(() => {
        let data = [];
        // get the webiste elements
        let aHrefRank = document.querySelector('#topAhrefsRank');
        let urlRating = document.querySelector('#UrlRatingContainer span');
        let domainRating = document.querySelector('#DomainRatingContainer span');
        let backLinks = document.querySelector('#numberOfRefPages a');
        let backLinksPastDays = document.querySelector('#numberOfRefPages small');
        let referringDomains = document.querySelector('#numberOfRefDomains a');
        let organicKeywords = document.querySelector('#numberOfOrganicKeywords');
        let organicKeywordsPastDays = document.querySelector('#numberOfOrganicKeywords small');
        let organicTraffic = document.querySelector('#numberOfOrganicTraffic span');
        let organicTrafficPastDays = document.querySelector('#numberOfOrganicTraffic small');
        let trafficValue = document.querySelector('#numberOfOrganicTrafficCost');

        data.push('Ahrefs Rank: ', getPromise(aHrefRank));
        // data.push('Url Rating: ', urlRating ? urlRating.innerText : 'N/A');
        // data.push('Domain Rating: ', getPromise(domainRating));
        // data.push('BackLinks: ', getPromise(backLinks));
        // data.push('BackLinks Last 7 Days: ', getPromise(backLinksPastDays));
        // data.push('Referreing Domains: ', getPromise(referringDomains));
        // data.push('Referreing Domains Last 7 Days: ', getPromise(organicKeywordsPastDays));
        // data.push('Organic Traffic: ', getPromise(organicTraffic));
        // data.push('Organic Traffic Past 7 Days: ', getPromise(organicTrafficPastDays));
        // data.push('Traffic Value: ', getPromise(trafficValue));
        return data
    });

    console.dir(webisteData);

})();
*/


/*
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1100, height: 768});

    // await page.setUserAgent('newUserAgent');
    await page.setRequestInterception(true);
    page.on('request', request => {
        request.continue({
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
            }
        });
    });
    await page.goto(url);
    await page.waitFor(2500);
})();*/
