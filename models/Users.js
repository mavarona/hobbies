const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(60),
    img: Sequelize.STRING(30),
    description: Sequelize.TEXT,
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Añada un correo válido'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            }
        }
    },
    active: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tokenPassword: Sequelize.STRING,
    expireIn: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(user) {
            user.password = Users.prototype.hashPassword (user.password);
        }
    }
});

Users.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

Users.prototype.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = Users;