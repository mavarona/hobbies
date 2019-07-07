const Groups = require('../models/Groups');
const Meeti = require('../models/Meeti');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.panelAdmin = async(req, res) => {

    const queries = [];

    queries.push(Groups.findAll({
        where: {
            userId: req.user.id
        }
    }));
    queries.push(Meeti.findAll({
        where: {
            userId: req.user.id,
            date: {
                [Op.gte]: moment(new Date()).format("YYYY-MM-DD")
            }
        }
    }));
    queries.push(Meeti.findAll({
        where: {
            userId: req.user.id,
            date: {
                [Op.lt]: moment(new Date()).format("YYYY-MM-DD")
            }
        }
    }));

    const [groups, meeti, previous] = await Promise.all(queries);

    res.render('admin', {
        namePage: 'Panel de Administración',
        groups,
        meeti,
        previous,
        moment
    });
};