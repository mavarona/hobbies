const Users = require('../models/Users');
const {
    validationResult
} = require('express-validator');
const sendEmail = require('../handlers/email');

exports.formCreateAccount = (req, res) => {
    res.render('create-account', {
        namePage: 'Crea tu Cuenta'
    });
};

exports.createAccount = async(req, res) => {

    const user = req.body;
    const errorsExp = validationResult(req);
    try {
        await Users.create(user);
        const url = `http://${req.headers.host}/confirm-account/${user.email}`;
        await sendEmail.send({
            user,
            url,
            subject: 'Confirma tu cuenta de Aficiones',
            file: 'confirm-account'
        });
        req.flash('exito', 'Hemos enviado un E-Mail, confirma tu cuenta');
        res.redirect('/login');
    } catch (err) {
        let errorsSequelize = [];
        let errorsExpress = [];
        if (err.errors) {
            errorsSequelize = err.errors.map(err => err.message);
        }
        if (errorsExp.errors) {
            errorsExpress = errorsExp.errors.map(err => err.msg);
        }
        const listErrors = [...errorsSequelize, ...errorsExpress];
        req.flash('error', listErrors);
        res.redirect('/create-account');

    }

};

exports.confirmAccount = async(req, res, next) => {
    const user = await Users.findOne({
        where: {
            email: req.params.email
        }
    });

    if (!user) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/create-account');
        return next();
    }

    user.active = 1;
    await user.save();
    req.flash('exito', 'La cuenta ha sido activada, ya puede iniciar sesión');
    res.redirect('/login');
}

exports.formLogin = (req, res) => {
    res.render('login', {
        namePage: 'Iniciar Sesión'
    });
};