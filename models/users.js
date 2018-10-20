module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    userid: DataTypes.STRING,
    useremail: DataTypes.STRING
  });
  return Users;
};
