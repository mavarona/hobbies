const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');

const Users = require('../models/Users');
const Groups = require('../models/Groups');

const Meeti = db.define('meeti', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe tener un título'
            }
        }
    },
    invited: Sequelize.STRING,
    cupo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe tener una descripción'
            }
        }
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe añadir una fecha'
            }
        }
    },
    hour: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe añadir una hora'
            }
        }
    },
    slug: Sequelize.STRING,
    address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe tener una dirección'
            }
        }
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe indicar una ciudad'
            }
        }
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe indicar una región'
            }
        }
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe indicar un país'
            }
        }
    },
    geo: {
        type: Sequelize.GEOGRAPHY('POINT')
    },
    interested: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    }
}, {
    hooks: {
        async beforeCreate(meeti) {
            const url = slug(meeti.title).toLowerCase();
            meeti.slug = `${url}-${shortid.generate()}`
        },
    }
});

Meeti.belongsTo(Users);
Meeti.belongsTo(Groups);

module.exports = Meeti;