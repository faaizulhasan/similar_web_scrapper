const port = 3000;
const Bot = require('./Bot/scrapper');
/** Web Server */
let express = require('express');
var cors = require('cors')
var bodyParser = require("body-parser");
let app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/get-info', async (req, res) => {
    const bot = new Bot();
    await bot.launch();
    await bot.initPage(); //.then(() => console.log("Page Opened"));
    await bot.visitWebsite();//.then(() => console.log("BROWSING WEBSITE"));
    await bot.searchCompany(req.query.query);//.then(() => console.log("BROWSING WEBSITE"));
    let data = await bot.getInfo();//.then(() => console.log("GET COMPANY INFO"));
    console.log("Got Data: ", data);
    await bot.closeBrowser();
    res.send(data);
});

app.listen(port, '0.0.0.0', () => console.log("Server listening at port " + port));