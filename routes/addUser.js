const mongoose = require('mongoose');

//used only to create a user with a hashed password.
//this will be disabled on launch.

const UserAdmin = mongoose.model('UserAdmin');


//hash pw and posts into mongo
module.exports = app => {
    app.post('/api/adduser', (req, res) => {
        console.log(req.body);
        new UserAdmin({
            username: req.body.loginId,
            password: req.body.loginPassword
        }).save()
            .then(() => {
                res.send("item saved to database");
            })
            .catch(err => {
                res.status(400).send(err);
            })
    });
}