var hotels = require("./hotels")

module.exports = function(sequelize, DataTypes) {
    var Events = sequelize.define("Events", {
      eventdates: DataTypes.STRING,
      eventtime: DataTypes.TEXT,
      eventpics: DataTypes.STRING,
      eventtitle: DataTypes.STRING,
      ticketlink: DataTypes.STRING,
      city: DataTypes.STRING,
      userid: DataTypes.STRING,
    }); 
    // Events.associate = function(models) {
    //   // We're saying that a Post should belong to an Author
    //   // A Post can't be created without an Author due to the foreign key constraint
    //   Events.belongsTo(models.hotels, {
    //     foreignKey: {
    //       allowNull: false
    //     }
    //   });
    // };
    return Events;
  };
