const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');

//require models to initialize them.
//require passport AFTER models are initialized.
require('./models/AdminModel');
require('./models/UserModel');
require('./services/passport');

const addUserRoute = require('./routes/addUser');
const loginRoute = require('./routes/login');
const googleOAuthRoute = require('./routes/googleAuthRoutes');
const dropboxRoutes = require('./routes/dropboxRoutes');


mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
//these two lines replace body parser.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require('http').createServer(app);
const io = require('socket.io')(http);
http.listen(4000, () => {
    console.log('listening on *:4000');
});

const PORT = process.env.PORT || 5000;

//needed for Google OAuth
app.use(
    cookieSession({
        //math = 30 days. it has to be passed in as millisecconds.
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]        
    })
);

//initialize passport before routes.
app.use(passport.initialize());
app.use(passport.session());

//routes
addUserRoute(app);
loginRoute(app);
googleOAuthRoute(app);
dropboxRoutes(app, io);


app.use('/admin/tools/testing', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT)
});



