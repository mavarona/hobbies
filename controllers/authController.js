const passport = require('passport');

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Debe introducir un correo y una contraseña'
});

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

exports.logout = (req, res, next) => {
    req.logout();
    req.flash('exito', 'Sesión cerrada correctamente');
    res.redirect('/login');
    next();
}