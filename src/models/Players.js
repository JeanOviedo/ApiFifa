const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('players', {
    name: {
      type: DataTypes.STRING,
    
     
    },
    position: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    nation: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    nationid: {
      type: DataTypes.STRING,
     
    },

    team: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
    imgjugador: {
      type: DataTypes.STRING,
      defaultValue: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Image_of_none.svg/1200px-Image_of_none.svg.png",
    },

    img: {
      type: DataTypes.STRING,
      defaultValue: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Image_of_none.svg/1200px-Image_of_none.svg.png",
    },

    items: {
      type: DataTypes.STRING,
      defaultValue: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Image_of_none.svg/1200px-Image_of_none.svg.png",
    },

  
    page: {
      type: DataTypes.INTEGER,
    
    },

    totalPages: {
      type: DataTypes.INTEGER,
     
    },
    totalResults: {
      type: DataTypes.INTEGER,
     
    },



   
  });
};
