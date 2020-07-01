const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');
const privateKey = require("./google_key.json");

//require models to initialize them.
//require passport AFTER models are initialized.
require('./models/AdminModel');
require('./models/UserModel');
require('./services/passport');

const addUserRoute = require('./routes/addUser');
const loginRoute = require('./routes/login');
const googleOAuthRoute = require('./routes/googleAuthRoutes');
const dropboxRoutes = require('./routes/dropboxRoutes');
const jackpotNumberRoutes = require('./routes/jackpotNumberRoutes');
const googleAnalyticsServiceRoute = require('./routes/googleAnalyticsServiceRoute');


mongoose
  .connect(process.env.mongoURI || keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

const app = express();
//these two lines replace body parser.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
//socket.io using to show continous data to front end during uploading session.
const http = require('http').createServer(app);
const io = require('socket.io')(http);
http.listen(4000, () => {
    console.log('listening on *:4000');
});
*/



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
//dropboxRoutes(app, io);
dropboxRoutes(app);
jackpotNumberRoutes(app);
googleAnalyticsServiceRoute(app);


app.use('/admin/tools/backend', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use('/privacypolicy', (req, res) => {
    res.sendFile(__dirname + '/privacypolicy.html');
});

app.use('/googleatest', (req, res) => {
    res.sendFile(__dirname + '/HelloAnalytics.html');
});

app.use('/gaTest1', (req, res) => {
    res.sendFile(__dirname + '/gaTest1.html');
});

app.use('/gaTest2', (req, res) => {
    res.sendFile(__dirname + '/gaTest2.html');
});



if(process.env.NODE_ENV === 'production') {
    //express will serve up production assets like our main.js file or main.css file
    app.use(express.static('client/build'));

    //express will serve up the index.html file if it doesnt recognize route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT)
});



