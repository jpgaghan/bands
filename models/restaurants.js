module.exports = function(sequelize, DataTypes) {
    var Restaurants = sequelize.define("Restaurants", {
      img: DataTypes.STRING,
      name: DataTypes.STRING,
      url: DataTypes.STRING,
      rating: DataTypes.STRING,
      city: DataTypes.STRING,
      phone: DataTypes.STRING,
      street: DataTypes.STRING,
      userid: DataTypes.STRING
    });
    return Restaurants;
  };
