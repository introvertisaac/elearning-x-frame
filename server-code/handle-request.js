const express = require("express");
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 443; // HTTPS default port

// Path to your SSL/TLS certificate and key files
const certFilePath = '/etc/letsencrypt/live/code-org.smartbrainskenya.com/fullchain.pem';
const keyFilePath = '/etc/letsencrypt/live/code-org.smartbrainskenya.com/privkey.pem';

// Read the SSL/TLS certificate and key files
const cert = fs.readFileSync(certFilePath);
const key = fs.readFileSync(keyFilePath);

// SSL/TLS certificate options
const options = {
    cert: cert,
    key: key
};

/**
 * Extract domain from a url
 *
 * @param {string} url
 * @returns
 */
function extractDomain(url) {
    const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);
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
        const response = await axios.get(url);
        const html = response.data;

        /**
         * Relative url should be absolute
         */

        res.send(prepareFinalData(html, domain));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while fetching the URL");
    }
});

// Create an HTTPS server
const server = https.createServer(options, app);

// Start the server
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
