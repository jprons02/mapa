const mongoose = require('mongoose');

const UserAdmin = mongoose.model('UserAdmin');

//fetch user and test password verification
module.exports = app => {
    app.post('/api/login', (req, res) => {
        UserAdmin.findOne({username: req.body.username}, (err, user) => {
            if (err) throw err;
            
            if(!user) {
                res.send(false);
                return;
            }
            
            //test a matching password
            user.comparePassword(req.body.password, (err, isMatch) => {
                console.log('testing matching password');
                if (err) throw err;
                //handle what to do if password matches on front end. No if statement here, just send response (true or false).
                res.send({
                    username: req.body.username,
                    isMatch
                });

            })
        })
    });
}