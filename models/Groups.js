const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const Categories = require('./Categories');
const Users = require('./Users');

const Groups = db.define('groups', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
    },
    name: {
        type: Sequelize.TEXT(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El grupo debe tener un nombre'
            }
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca alguna descripción'
            }
        }
    },
    url: Sequelize.TEXT,
    img: Sequelize.TEXT
});

Groups.belongsTo(Categories);
Groups.belongsTo(Users);

module.exports = Groups;