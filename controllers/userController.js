const Users = require('../models/Users');
const {
    validationResult
} = require('express-validator');
const sendEmail = require('../handlers/email');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

multerConfig = {
    limits: {
        fileSize: 100000
    },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + '/../public/uploads/profiles/');
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, next) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            next(null, true);
        } else {
            next(new Error('Formato no válido'), false);
        }
    }
}

const upload = multer(multerConfig).single('img');

exports.uploadImage = (req, res, next) => {
    upload(req, res, function(err) {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande, máximo 100 Kbs');
                } else {
                    req.flash('error', err.message);
                }
            } else if (err.hasOwnProperty('message')) {
                req.flash('error', err.message);
            }
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
}

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

exports.formEditProfile = async (req, res) =>{
    
    const user = await Users.findByPk(req.user.id);

    res.render('edit-profile',{
        namePage: 'Editar Perfil',
        user
    })

}

exports.editProfile = async (req, res) => {

    const user = await Users.findByPk(req.user.id);

    const { name, description, email } = req.body;

    user.name = name;
    user.description = description;
    user.email = email;

    await user.save();
    req.flash('exito', 'Los datos han sido cambiados');
    res.redirect('/admin');

}

exports.formChangePassword = (req, res) => {

    res.render('change-password',{
        namePage: 'Cambiar Contraseña'
    });

}

exports.changePassword = async (req, res, next) => {

    const user = await Users.findByPk(req.user.id);

    const { oldPassword, newPassword } = req.body;

    if(!user.validatePassword(oldPassword)){
        req.flash('error', 'El password actual no es correcto');
        res.redirect('/admin');
        return next(); 
    }

    const hash = user.hashPassword(newPassword);

    user.password = hash;

    await user.save();

    req.logout();
    req.flash('exito', 'La contraseña se cambió, vuelve a iniciar sesión');
    res.redirect('/login');

}

exports.formImageProfile = async (req, res) => {
    
    const user = await Users.findByPk(req.user.id);

    res.render('image-profile',{
        namePage: 'Guardar Imagen de Perfil',
        user
    });

}

exports.imageProfile = async (req, res, next) => {
    
    const user = await Users.findByPk(req.user.id);

    if (!user) {
        req.flash('error', 'Operación no valida');
        res.redirect('/login');
        return next();
    }

    if (req.file && user.img) {
        const imgOldPath = __dirname + `/../public/uploads/profiles/${user.img}`;
        fs.unlink(imgOldPath, (err) => {
            if (err) {
                console.log(err.message);
            }
            return;
        });
    }

    if (req.file) {
        user.img = req.file.filename;
    }

    await user.save();
    req.flash('exito', 'Cambios Guardados');
    res.redirect('/admin');

}