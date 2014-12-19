"use strict";

module.exports = function(sequelize, DataTypes) {
  var site = sequelize.define("site", {
    siteName: DataTypes.STRING,
    siteRef: DataTypes.STRING,
    image: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    county: DataTypes.STRING,
    country: DataTypes.STRING,
    longitude: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT,
    siteUrl: DataTypes.TEXT,
    siteNotes: DataTypes.TEXT,
    dateVisited: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.site.belongsTo(models.user),
        models.site.hasMany(models.template)
      }
    }
  });

  return site;
};
