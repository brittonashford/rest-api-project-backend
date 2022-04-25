const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

//get user (protected)
router.get('/users', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser; //from auth-user, so we know it's valid

    res.status(200);
    res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

//add user
router.post('/users', asyncHandler(async(req, res) => {
    try{
        const user = req.body;
        await User.create(user);
        res.status(201).location('/').end();
    } catch (error) {
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error; // punt to global error handler
        }
    }


}));

module.exports = router;