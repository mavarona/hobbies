const Meeti = require('../../models/Meeti');
const Groups = require('../../models/Groups');
const Users = require('../../models/Users');
const Categories = require('../../models/Categories');
const Comments = require('../../models/Comments');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

    const geo = Sequelize.literal(`ST_GeomFromText( 'POINT( ${meeti.geo.coordinates[0]} ${meeti.geo.coordinates[1]} )', 4326 )`);

    const distance = Sequelize.fn('ST_Distance', Sequelize.col('geo'), geo);

    const nearMeetis = await Meeti.findAll({
        order: distance,
        where: Sequelize.where(distance, {
            [Op.lte]: 2000
        }),
        limit: 3,
        offset: 1,
        include: [{
                model: Groups
            },
            {
                model: Users,
                attributes: ['id', 'name', 'img']
            }
        ]
    });

    const comments = await Comments.findAll({
        where: { meetiId: meeti.id },
        include: [{
            model: Users,
            attributes: ['id', 'name', 'img']
        }]
    });

    res.render('show-meeti', {
        namePage: meeti.title,
        meeti,
        comments,
        nearMeetis,
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

exports.showCategory = async(req, res, next) => {

    const category = await Categories.findOne({
        attributes: ['id', 'name'],
        where: {
            slug: req.params.category
        }
    });

    const meetis = await Meeti.findAll({
        order: [
            ['date', 'ASC'],
            ['hour', 'ASC']
        ],
        include: [{
                model: Groups,
                where: { categoryId: category.id }
            },
            {
                model: Users
            }
        ]
    });

    res.render('category', {
        namePage: `Categoría: ${category.name}`,
        meetis,
        moment
    })

}