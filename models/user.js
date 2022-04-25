'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}

    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: '"firstName" is required.'
                },
                notEmpty: {
                    msg: 'First name cannot be blank.'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: '"lastName" is required.'
                },
                notEmpty: {
                    msg: 'Last name cannot be blank.'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: '"emailAddress" is required.'
                },
                notEmpty: {
                    msg: 'Email address cannot be blank.'
                },
                isEmail: {
                    msg: 'Please enter a valid email address.'
                }               
            },
            unique: {
                args: true,
                msg: 'Please enter a valid email address.'
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('password', hashedPassword);
            },
            validate: {
                notNull: {
                    msg: '"password" is required.'
                },
                notEmpty: {
                    msg: 'Password cannot be blank.'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'User'
    });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'userInfo',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    };

    return User;
};