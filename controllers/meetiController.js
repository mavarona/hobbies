const Groups = require('../models/Groups');
const Meeti = require('../models/Meeti');

exports.formNewMeeti = async(req, res) => {
    const groups = await Groups.findAll({
        where: {
            userId: req.user.id
        }
    });

    res.render('new-meeti', {
        namePage: 'Crear Nuevo Meeti',
        groups
    });
};

exports.createMeeti = async(req, res) => {

    const meeti = req.body;

    meeti.userId = req.user.id;

    const point = {
        type: 'Point',
        coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
    };

    meeti.geo = point;

    if (req.body.cupo === '') {
        meeti.cupo = 0;
    }

    try {
        await Meeti.create(meeti);
        req.flash('exito', 'Meeti creado');
        res.redirect('/admin');
    } catch (err) {
        let errorsSequelize = [];
        if (err.errors) {
            errorsSequelize = err.errors.map(err => err.message);
        }
        req.flash('error', errorsSequelize);
        res.redirect('/new-meeti');
    }

}

exports.formEditMeeti = async (req, res, next) => {
   let queries = [];

    queries.push(Groups.findAll({
        where: {
            userId: req.user.id
        }
    }));
    queries.push(Meeti.findByPk(req.params.id));

    const [groups, meeti] = await Promise.all(queries);

    if(!groups || !meeti){
        req.flash('error', 'Operación no válida');
        res.redirect('/admin');
        return next();
    }

    res.render('edit-meeti',{
        namePage: `Editar Meeti : ${meeti.title}`,
        groups,
        meeti
    });

}