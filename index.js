const Bot = require('./Bot/scrapper');

const run = async () => {
    const bot = new Bot();
    await bot.initPuppeter().then(() => console.log("PUPPETEER INITIALIZED"));
    await bot.visitWebsite().then(() => console.log("BROWSING WEBSITE"));
    // await bot.getInfo().then(() => console.log("GET COMPANY INFO"));
    // await bot.closeBrowser().then(() => console.log("BROWSER CLOSED"));
}

run().catch(e => console.log(e.message));

