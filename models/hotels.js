module.exports = function(sequelize, DataTypes) {
    var Hotels = sequelize.define("Hotels", {
      address: DataTypes.STRING,
      telephone: DataTypes.TEXT,
      website: DataTypes.STRING,
      city: DataTypes.STRING,
      name: DataTypes.STRING,
      userid: DataTypes.STRING
    });
    return Hotels;
  };