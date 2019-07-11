const Meeti = require('../../models/Meeti');
const Groups = require('../../models/Groups');
const Users = require('../../models/Users');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

exports.resultSearch = async(req, res) => {

    const { category, title, city, country } = req.query;

    const searchAll = {
        where: {
            title: {
                [Op.iLike]: '%' + title + '%'
            },
            city: {
                [Op.iLike]: '%' + city + '%'
            },
            country: {
                [Op.iLike]: '%' + country + '%'
            }
        },
        include: [{
                model: Groups,
                where: {
                    categoryId: {
                        [Op.eq]: category
                    }
                }
            },
            {
                model: Users,
                attributes: ['id', 'name', 'img']
            }
        ]
    };

    const searchAllWithoutCatefory = {
        where: {
            title: {
                [Op.iLike]: '%' + title + '%'
            },
            city: {
                [Op.iLike]: '%' + city + '%'
            },
            country: {
                [Op.iLike]: '%' + country + '%'
            }
        },
        include: [{
                model: Groups
            },
            {
                model: Users,
                attributes: ['id', 'name', 'img']
            }
        ]
    };

    let meetis = {};

    if(category === ''){
        meetis = await Meeti.findAll(searchAllWithoutCatefory);
    }else{
        meetis = await Meeti.findAll(searchAll);
    }
    
    res.render('search', {
        namePage: 'Resultados de la búsqueda',
        meetis,
        moment
    });

}