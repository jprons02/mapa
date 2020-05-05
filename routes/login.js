const mongoose = require('mongoose');

const UserAdmin = mongoose.model('UserAdmin');

//fetch user and test password verification
module.exports = app => {
    app.use('/api/login', (req, res) => {
        UserAdmin.findOne({username: req.body.loginId}, (err, user) => {
            if (err) throw err;
            
            if(!user) {
                res.send('wrong login...');
                return;
            }
            
            console.log('the user is: ' + user);

            //test a matching password
            user.comparePassword(req.body.loginPassword, (err, isMatch) => {
                if (err) throw err;
                console.log(req.body.loginPassword, isMatch);

                if(isMatch) {
                    res.send('Welcome, admin.');
                } else {
                    res.redirect('/');
                }
            })
        })
    });
}