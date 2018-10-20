module.exports = function(sequelize, DataTypes) {
    var Concerts = sequelize.define("Concerts", {
      location: DataTypes.STRING,
      date: DataTypes.STRING,
      time: DataTypes.STRING,
      venue: DataTypes.STRING,
      city: DataTypes.STRING,
      userid: DataTypes.STRING
    });
    return Concerts;
  };