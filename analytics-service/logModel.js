const { sequelize } = require('./config/database');
const Datatypes = require('sequelize');

const LogModel = sequelize.define('Url', {
    id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    slug: {
        type: Datatypes.STRING,
        allowNull: false,
    },
    timeStamp: {
        type: Datatypes.DATE,
        defaultValue: Datatypes.NOW,
    },
    ip: {
        type: Datatypes.STRING,
        allowNull: false,
    },
    referer: {
        type: Datatypes.STRING,
        allowNull: true,
    },
    device: {
        type: Datatypes.STRING,
        allowNull: true,
    },
    os: {
        type: Datatypes.STRING,
        allowNull: true,
    },
    browser: {
        type: Datatypes.STRING,
        allowNull: true,
    },
    location: {
        city: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        country: {
            type: Datatypes.STRING,
            allowNull: true,
        },
    }
});

module.exports = LogModel;