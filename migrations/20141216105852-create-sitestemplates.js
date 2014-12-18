"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("sitestemplates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      siteId: {
        type: DataTypes.INTEGER
      },
      templateId: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("sitestemplates").done(done);
  }
};