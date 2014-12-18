"use strict";

module.exports = function(sequelize, DataTypes) {
  var site = sequelize.define("site", {
    siteName: DataTypes.STRING,
    siteRef: DataTypes.INTEGER,
    image: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.INTEGER,
    county: DataTypes.STRING,
    country: DataTypes.STRING,
    longitude: DataTypes.INTEGER,
    latitude: DataTypes.INTEGER,
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
