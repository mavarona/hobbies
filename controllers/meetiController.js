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

exports.editMeeti = async (req, res, next) => {
    const meeti = await Meeti.findOne({
        where:{
            id: req.params.id,
            userId: req.user.id
        }
    });

    if(!meeti){
        req.flash('error', 'Operación no válida');
        res.redirect('/admin');
        return next();
    }

    const { groupId, title, invited, date, hour, cupo, description, address, city, state, country, lat, lng } = req.body;

    meeti.title = title;
    meeti.invited = invited;
    meeti.date = date;
    meeti.hour = hour;
    meeti.cupo = cupo;
    meeti.description = description;
    meeti.address = address;
    meeti.city = city;
    meeti.state = state;
    meeti.country = country;

    const point = {
        type: 'Point',
        coordinates: [parseFloat(lat), parseFloat(lng)]
    };
    meeti.geo = point;

    try {
        await meeti.save();
        req.flash('exito', 'Meeti Actualizado');
        res.redirect('/admin');
    } catch (err) {
        let errorsSequelize = [];
        if (err.errors) {
            errorsSequelize = err.errors.map(err => err.message);
        }
        req.flash('error', errorsSequelize);
        res.redirect(`/update-meeti/${req.params.id}`);
    }

}

exports.formDeleteMeeti = async (req, res, next) => {
    const meeti = await Meeti.findOne({
        where:{
            id: req.params.id,
            userId: req.user.id
        }
    });

    if(!meeti){
        req.flash('error', 'Operación no válida');
        res.redirect('/admin');
        return next();
    }

    res.render('delete-meeti',{
        namePage: `Eliminar Meeti : ${meeti.title}`
    })

}

exports.deleteMeeti = async (req, res, next) =>{
    await Meeti.destroy({
        where:{
            id: req.params.id
        }
    }); 
    req.flash('exito', 'Meeti Eliminado');
    res.redirect('/admin'); 
}