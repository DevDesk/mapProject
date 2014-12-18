"use strict";

module.exports = function(sequelize, DataTypes) {
  var template = sequelize.define("template", {
    templateName: DataTypes.STRING,
    templateRef: DataTypes.INTEGER,
    bubbleEvent: DataTypes.STRING,
    zoomLevel: DataTypes.INTEGER,
    centerLongitude: DataTypes.INTEGER,
    centerLatitude: DataTypes.INTEGER,
    bubbleOn: DataTypes.BOOLEAN,
    panelOn: DataTypes.BOOLEAN,
    urlShare: DataTypes.TEXT,
    embedCode: DataTypes.TEXT,
    description: DataTypes.TEXT,
    notes: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        models.template.hasMany(models.site)
      }
    }
  });

  return template;
};
