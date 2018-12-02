const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const app = express();

// parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/user'));
app.use(require('./routes/login'));
app.use(require('./routes/categoria'));
app.use(require('./routes/producto'));

mongoose.connect('mongodb://ivanfelix:Marciano88@ds121982.mlab.com:21982/nodeprueba', (err, res) => {
    if (err) {
        console.log(err);
    }
});

app.listen(3000, function() {
    console.log('Escuchando puerto', 3000);
})