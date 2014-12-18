"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("templates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      templateName: {
        type: DataTypes.STRING
      },
      templateRef: {
        type: DataTypes.INTEGER
      },
      bubbleEvent: {
        type: DataTypes.STRING
      },
      zoomLevel: {
        type: DataTypes.INTEGER
      },
      centerLongitude: {
        type: DataTypes.INTEGER
      },
      centerLatitude: {
        type: DataTypes.INTEGER
      },
      bubbleOn: {
        type: DataTypes.BOOLEAN
      },
      panelOn: {
        type: DataTypes.BOOLEAN
      },
      urlShare: {
        type: DataTypes.TEXT
      },
      embedCode: {
        type: DataTypes.TEXT
      },
      description: {
        type: DataTypes.TEXT
      },
      notes: {
        type: DataTypes.TEXT
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
    migration.dropTable("templates").done(done);
  }
};