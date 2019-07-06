const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/Users');


passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email, password, next) => {
        const user = await Users.findOne({
            where: {
                email,
                active: 1
            }
        });

        if (!user) return next(null, false, {
            message: 'El usuario o el password son incorrectos'
        });

        const verifyPass = user.validatePassword(password);
        if (!verifyPass) return next(null, false, {
            message: 'El usuario o el password son incorrectos'
        });

        return next(null, user);

    }

));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(user, cb) {
    cb(null, user);
});

module.exports = passport;