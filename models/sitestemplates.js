"use strict";

module.exports = function(sequelize, DataTypes) {
  var sitestemplates = sequelize.define("sitestemplates", {
    siteId: DataTypes.INTEGER,
    templateId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return sitestemplates;
};
