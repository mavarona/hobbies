const Users = require('../../models/Users');
const Groups = require('../../models/Groups');

exports.showUser = async(req, res, next) => {

    let queries = [];

    queries.push(Users.findOne({
        where: {
            id: req.params.id
        }
    }));

    queries.push(Groups.findAll({
        where: {
            userId: req.params.id
        }
    }));

    const [user, groups] = await Promise.all(queries);

    if (!user) {
        res.redirect('/');
        return next();
    }

    res.render('show-profile', {
        namePage: `Perfil del Usario ${user.name}`,
        user,
        groups
    })


}