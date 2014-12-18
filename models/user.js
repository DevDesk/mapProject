"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [5,100],
          msg: "enter a password between 5 and 100 characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address.'
        }
      }
    },
    userName: DataTypes.STRING
  }, 
  {
    classMethods: {
      associate: function(models) {
        models.user.hasMany(models.site)
      }
    },
    hooks: {
      beforeCreate: function(data, trash, sendback) {
        var pwdToEncrypt = data.password;


        bcrypt.hash(pwdToEncrypt, 10, function (err,hash) {
  
          data.password = hash;
          sendback(null, data); 
        })
      }
    }
  });

  return user;
};
