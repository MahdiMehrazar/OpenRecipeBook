const express = require('express');
const compression = require('compression')
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./api/config/database');

// Connect to database via mongoose 
mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { promiseLibrary: require('bluebird') })
    .then(() => console.log('Connected to database ' +config.database))
    .catch((err) => console.log('Database error: '+err));

const app = express();

const users = require('./api/routes/users');
const recipes = require('./api/routes/recipes');
const comments = require('./api/routes/comments');
const files = require('./api/routes/files');
const search = require('./api/routes/search');

// Port Number
const port = process.env.PORT || 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'dist')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// compress all responses
app.use(compression());


require('./api/config/passport')(passport);

app.use('/api/users', users);
app.use('/api/recipes', recipes);
app.use('/api/recipes', comments);
app.use('/api/files', files);
app.use('/api/search', search);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log('Server started on port '+port);
});