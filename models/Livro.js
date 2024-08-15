const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Livro = sequelize.define('Livro', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    autor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroPaginas: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    dataInicio: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dataTermino: {
        type: DataTypes.DATE,
        allowNull: true
    },
    nota: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 5
        }
    },
    comentarios: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Livro;
