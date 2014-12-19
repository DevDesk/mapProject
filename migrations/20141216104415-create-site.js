"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("sites", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      siteName: {
        type: DataTypes.STRING
      },
      siteRef: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING
      },
      address1: {
        type: DataTypes.STRING
      },
      address2: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING
      },
      zip: {
        type: DataTypes.INTEGER
      },
      county: {
        type: DataTypes.STRING
      },
      country: {
        type: DataTypes.STRING
      },
      longitude: {
        type: DataTypes.FLOAT
      },
      latitude: {
        type: DataTypes.FLOAT
      },
      siteUrl: {
        type: DataTypes.TEXT
      },
      siteNotes: {
        type: DataTypes.TEXT
      },
      dateVisited: {
        type: DataTypes.DATE
      },
      userId: {
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
    migration.dropTable("sites").done(done);
  }
};