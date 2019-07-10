const Meeti = require('../../models/Meeti');
const Groups = require('../../models/Groups');
const Users = require('../../models/Users');
const moment = require('moment');
const Sequelize = require('sequelize');

exports.showMeeti = async(req, res, next) => {
    const meeti = await Meeti.findOne({
        where: {
            slug: req.params.slug
        },
        include: [{
                model: Groups
            },
            {
                model: Users,
                attributes: ['id', 'name', 'img']
            }
        ]
    });

    if (!meeti) {
        res.redirect('/');
    }

    res.render('show-meeti', {
        namePage: meeti.title,
        meeti,
        moment
    })

}

exports.confirmAssistance = async(req, res) => {

    const {
        operation
    } = req.body;

    if (operation === 'confirm') {
        Meeti.update({
            interested: Sequelize.fn('array_append', Sequelize.col('interested'), req.user.id)
        }, {
            'where': {
                'slug': req.params.slug
            }
        });

        res.send('Has Confirmado tu asistencia');

    } else {
        Meeti.update({
            interested: Sequelize.fn('array_remove', Sequelize.col('interested'), req.user.id)
        }, {
            'where': {
                'slug': req.params.slug
            }
        });

        res.send('Has Cancelado tu asistencia');

    }

}

exports.showInterested = async(req, res) => {

    const meeti = await Meeti.findOne({
        where: {
            slug: req.params.slug
        },
        attributes: ['interested']
    });

    const {
        interested
    } = meeti;

    const assistances = await Users.findAll({
        attributes: ['name', 'img'],
        where: {
            id: interested
        }
    });

    res.render('assitances-meeti', {
        namePage: 'Listado de Asistentes al Meeti',
        assistances
    });

}