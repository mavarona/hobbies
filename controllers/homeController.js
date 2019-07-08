const Categories = require('../models/Categories');
const Meeti = require('../models/Meeti');
const Groups = require('../models/Groups');
const Users = require('../models/Users');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.home = async (req, res) => {

    let queries = [];
    queries.push(Categories.findAll({}));
    queries.push(Meeti.findAll({
        attributes: ['slug', 'title', 'date', 'hour'],
        where: {
            date: { [Op.gte]: moment(new Date()).format('YYYY-MM-DD')}
        },
        limit: 3,
        order: [
            ['date', 'ASC']
        ],
        include: [
            {
                model: Groups,
                attributes: ['img']
            },
            {
                model: Users,
                attributes: ['name', 'img']
            }
        ]
    }));

    const [categories, meetis] = await Promise.all(queries);

    res.render('home', {
        namePage: 'Escritorio',
        categories,
        meetis,
        moment
    });
}