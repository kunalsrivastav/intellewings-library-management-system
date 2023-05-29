const express = require('express');
const path = require('path');
const router = express.Router();

/* This code is defining a route for a GET request to the root URL ("/") of the server. When a client
makes a GET request to the root URL, the server will respond by sending the contents of the
"server-status.html" file located in the "static" directory of the server's file system. The
"path.resolve" method is used to ensure that the correct file path is used regardless of the current
working directory of the server. */
router.get('/', (req, res) => {
    res.status(200).type('html').sendFile(path.resolve(__dirname, '../static/server-status.html'));
});

module.exports = router;