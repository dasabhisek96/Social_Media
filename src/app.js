const express = require('express'),
app = express();

const port = process.env.PORT || 3000;

app.set('port',port);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./models/db')();
require('./routes/index')(app);

app.listen(port);
console.log('Server started '+ port);

module.exports = app;