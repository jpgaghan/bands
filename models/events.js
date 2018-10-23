module.exports = function(sequelize, DataTypes) {
    var Events = sequelize.define("Events", {
      eventdates: DataTypes.STRING,
      eventtime: DataTypes.TEXT,
      eventpics: DataTypes.STRING,
      eventtitle: DataTypes.STRING,
      ticketlink: DataTypes.STRING,
      city: DataTypes.STRING,
      userid: DataTypes.STRING
    }); 
    return Events;
  };
