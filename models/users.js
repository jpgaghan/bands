module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    userid: DataTypes.STRING,
    email: DataTypes.STRING
  });
  return Users;
};