'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.authenticateUser = async(req, res, next) => {
    let message;
    console.log(req);
    const credentials = auth(req);
    console.log(credentials);

    if (credentials) {
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        });

        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            if (authenticated) {
                console.log(`Auth successful for user: ${user.emailAddress}`);

                // store user on req
                req.currentUser = user;
            } else {
                message = `Auth failed for user: ${user.emailAddress}`;
            }
        } else {
            message = `User not founnd for user: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next(); // move on to next bit of middleware
    }
};