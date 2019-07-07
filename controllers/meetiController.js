const Groups = require('../models/Groups');

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