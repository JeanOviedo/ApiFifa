const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("teams", {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allownull: false
        },

    });
};
