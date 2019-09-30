const fs = require("fs");
const puppeteer = require('puppeteer');

class Scrapper {

    /**
     * Browser: Puppeteer
     * Page: Puppeteer.Page
     * Config: Config.json
     */
    constructor() {
        this.config = require("./Config/config.json");
    }

    async _evaluateFile(page, file) {
        return page.evaluateOnNewDocument(file)
    }

    async _return_var(page, passingVariable) {
        return await page.evaluate(passingVariable, cmd => cmd);
    }

    async _checkCaptcha(page, config) {
        let captcha = await page.evaluate((captcha) => {
            return document.querySelectorAll(captcha).length > 0;
        }, config.selectors.captcha_app);
        return captcha;
    }

    async launch() {
        this.browser = await puppeteer.launch(this.config.puppeteerConfig);
    }

    async initPage() {
        this.page = await this.browser.newPage();
        await this.page.setViewport(this.config.puppeteerResolution);

        for (let i in this.config.puppeteerPreloadJs) {
            let obj = this.config.puppeteerPreloadJs[i];
            const preloadFile = fs.readFileSync(obj[0], obj[1]);
            await this._evaluateFile(this.page, preloadFile);
        }

        await this.page.setExtraHTTPHeaders(this.config.puppeteerHttpHeaders);
    }

    async visitWebsite() {
        var response = await this.page.goto(this.config.url);
        // await this.page.screenshot({path: 'screenshot.png'});
        return response.headers();
        // await this.page.waitForNavigation();
    }

    async searchCompany(search_company) {
        if (await this._checkCaptcha(this.page, this.config)) {
            throw new Error("Got Captcha Application::Search")
        }

        await this.page.click(this.config.selectors.search_field);
        await this.page.keyboard.type(search_company);
        await this.page.waitFor(200);
        await this.page.click(this.config.selectors.search_button);
        await this.page.waitForNavigation();
    }

    async getInfo() {
        if (await this._checkCaptcha(this.page, this.config)) {
            throw new Error("Got Captcha Application")
        }

        let data = {};
        let sw = await this._return_var(this.page, this.config.evaluations.get_overview);
        let countries = await this._return_var(this.page, this.config.evaluations.get_countries);
        let overview = await this.page.evaluate((cmd) => {
            return window[cmd]();
        }, "getOverview");
        let engagement = (sw.EngagementsGA == null) ? sw.EngagementsSimilarweb : sw.EngagementsGA;
        data.url = sw.RedirectUrl;
        data.logo = sw.Icon;
        data.year_founded = overview.year_founded;
        data.headquarter = overview.headquarters;
        data.estimated_employees = overview.estimated_employees;
        data.global_rank = sw.GlobalRank[0];
        data.country_rank = sw.CountryRanks[sw.Country][0];
        data.country_name = countries[sw.Country].name;
        data.total_visits = engagement.TotalLastMonthVisits;
        data.pages_per_visit = engagement.PageViews;
        data.average_visit_duration = engagement.TimeOnSite;
        data.bounce_rate = engagement.BounceRate;
        data.traffic_sources = sw.TrafficSources;
        data.trafic_numbers = engagement.WeeklyTrafficNumbers;
        data.social = overview.social;
        data.last_overview = sw.Date;

        return data;
    }

    async closeBrowser() {
        await this.page.close();
        await this.browser.close();
    }
}

module.exports = Scrapper;