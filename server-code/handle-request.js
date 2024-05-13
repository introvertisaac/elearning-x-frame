const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3000;

/**
 * Extract domain from a url
 *
 * @param {string} url
 * @returns
 */
function extractDomain(url) {
    const match = url.match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
    );
    return match && match[0];
}

/**
 * Prepare final data
 */
function prepareFinalData(data, domain) {
    let finalData = data.replaceAll(/.(?<=="\/)(?<=.[^"]+)/gim, `${domain}/`);
    return finalData;
}

app.use(cors()); // Enable CORS for all routes

app.get("/bypass/*", async (req, res) => {
    const url = req.params[0];
    const domain = extractDomain(url);

    try {
        // Fetch content of the root domain
        const response = await axios.get("http://" + domain);
        let html = response.data;

        // Replace links and resources to point to the proxy server
        html = html.replace(/<a (.*?)href="(https?:)?\/\/(.*?)"/gi, '<a $1href="' + bypassAPILink + '$3"');
        html = html.replace(/(src|href)="(https?:)?\/\/(.*?)"/gi, '$1="' + bypassAPILink + '$3"');

        res.send(prepareFinalData(html, domain));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while fetching the URL");
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
