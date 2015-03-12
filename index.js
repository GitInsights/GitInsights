var app = require('./server/server.js');

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server Running...');
});

