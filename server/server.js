var express = require('express');
var app = express();

require('./middleware.js')(app);

module.exports = app;