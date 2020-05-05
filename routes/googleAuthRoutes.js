const passport = require('passport');

module.exports = app => {
    app.get('/auth/google',
        passport.authenticate('google', { scope: ['profile'] }));

    app.get('/auth/google/callback', 
        passport.authenticate('google', { failureRedirect: '/failed' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
    });
    /*
    //use this if you want to gather user data.
    app.get('/auth/google/callback', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    */

    app.get('/failed', (req, res) => {
        res.send('failed google auth');
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.send(req.user);
    });

    //testing what is req.user.
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
}