const Groups = require('../../models/Groups');
const Meeti = require('../../models/Meeti');
const moment = require('moment');

exports.showGruop = async(req, res, next) => {

    let queries = [];

    queries.push(Groups.findOne({
        where: {
            id: req.params.id
        }
    }));

    queries.push(Meeti.findAll({
        where: {
            groupId: req.params.id
        },
        order: ['date']
    }));

    const [group, meetis] = await Promise.all(queries);

    if (!group) {
        res.redirect('/');
        return next();
    }

    res.render('show-group', {
        namePage: `Información del grupo ${group.name}`,
        group,
        meetis,
        moment
    })

}