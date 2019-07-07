const Categories = require('../models/Categories');
const Groups = require('../models/Groups');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

multerConfig = {
    limits: {
        fileSize: 100000
    },
    storage: fileStoraga = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + '/../public/uploads/groups');
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

exports.formNewGroup = async(req, res) => {

    const categories = await Categories.findAll();

    res.render('new-group', {
        namePage: 'Crear un nuevo grupo',
        categories
    })
};

exports.newGroup = async(req, res) => {

    const group = req.body;
    group.userId = req.user.id;
    group.categoryId = req.body.category;

    if (req.file) {
        group.img = req.file.filename;
    }

    try {
        await Groups.create(group);
        req.flash('exito', 'El grupo se ha creado');
        res.redirect('/admin');
    } catch (err) {
        console.log(err);
        let errorsSequelize = [];
        if (err.errors) {
            errorsSequelize = err.errors.map(err => err.message);
        }
        req.flash('error', errorsSequelize);
        res.redirect('/new-group');
    }

};

exports.formEditGroup = async(req, res) => {

    queries = [];
    queries.push(Groups.findByPk(req.params.groupId));
    queries.push(Categories.findAll());

    const [group, categories] = await Promise.all(queries);

    res.render('edit-group', {
        namePage: `Editar Grupo : ${group.name}`,
        group,
        categories
    });
};

exports.editGroup = async(req, res) => {
    const group = await Groups.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });

    if (!group) {
        req.flash('error', 'Operación no valida');
        res.redirect('/admin');
        return next();
    }

    const {
        name,
        description,
        category,
        url
    } = req.body;

    group.name = name;
    group.description = description;
    group.categoryId = category;
    group.url = url;

    await group.save();
    req.flash('exito', 'Cambios Guardados');
    res.redirect('/admin');

};

exports.formImageGroup = async(req, res) => {

    const group = await Groups.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });

    res.render('image-group', {
        namePage: `Editar Imagen Grupo : ${group.name}`,
        group
    });

};

exports.imageGroup = async(req, res) => {

    const group = await Groups.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });

    if (!group) {
        req.flash('error', 'Operación no valida');
        res.redirect('/login');
        return next();
    }

    if (req.file && group.img) {
        const imgOldPath = __dirname + `/../public/uploads/groups/${group.img}`;
        fs.unlink(imgOldPath, (err) => {
            if (err) {
                console.log(err.message);
            }
            return;
        });
    }

    if (req.file) {
        group.img = req.file.filename;
    }

    await group.save();
    req.flash('exito', 'Cambios Guardados');
    res.redirect('/admin');

};

exports.formDeleteGroup = async(req, res, next) => {
    const group = await Groups.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });

    if (!group) {
        req.flash('error', 'Operación no valida');
        res.redirect('/login');
        return next();
    }

    res.render('delete-group', {
        namePage: `Eliminar Grupo : ${group.name}`
    })

};

exports.deleteGroup = async(req, res, next) => {
    const group = await Groups.findOne({
        where: {
            id: req.params.groupId,
            userId: req.user.id
        }
    });

    if (!group) {
        req.flash('error', 'Operación no valida');
        res.redirect('/login');
        return next();
    }

    if (group.img) {
        const imgOldPath = __dirname + `/../public/uploads/groups/${group.img}`;
        fs.unlink(imgOldPath, (err) => {
            if (err) {
                console.log(err.message);
            }
            return;
        });
    }

    await Groups.destroy({
        where: {
            id: req.params.groupId
        }
    });

    req.flash('exito', 'Grupo Eliminado');
    res.redirect('/admin');

};