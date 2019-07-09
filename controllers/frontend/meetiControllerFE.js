const Meeti = require('../../models/Meeti');
const Groups = require('../../models/Groups');
const Users = require('../../models/Users');
const moment = require('moment');

exports.showMeeti = async (req, res, next) => {
    const meeti = await Meeti.findOne({ 
        where : {
            slug: req.params.slug
        },
        include:[
            {
                model: Groups
            },
            {
                model: Users,
                attributes: ['id', 'name', 'img']
            }
        ]
    });

    if(!meeti){
        res.redirect('/');
    }

    res.render('show-meeti',{
        namePage: meeti.title,
        meeti,
        moment
    })

}