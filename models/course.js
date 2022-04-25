'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {}
    Course.init({
       title: {
           type: DataTypes.STRING,
           allowNull: false,
           validate: {
               notNull: {
                   msg: '"title" is required.'
               },
               notEmpty: {
                   msg: 'Title cannot be blank.'
               }
           }
       },
       description: {
           type: DataTypes.STRING,
           allowNull: false,
           validate: {
               notNull: {
                   msg: '"description" is required.'
               },
               notEmpty: {
                   msg: 'Description cannot be blank.'
               }
           }
       },
       estimatedTime: {
           type: DataTypes.TEXT
       },
       materialsNeeded: {
           type: DataTypes.STRING
       }  
    }, {
        sequelize,
        modelName: 'Course'
    });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'userInfo',
            foreignKey: {
                fieldName: 'userId'
            }
        });
    };

    return Course;
}