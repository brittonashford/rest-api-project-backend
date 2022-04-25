const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course, User } = require('../models');

//get all courses + user associated with each course (protected route)
router.get('/courses', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({
        include: [
            {
                model: User,
                as: 'userInfo',
                attributes: {
                    exclude: [
                        'password',
                        'createdAt',
                        'updatedAt'
                    ]
                }
            }
        ],
        attributes: {
            exclude: [
                'createdAt',
                'updatedAt'
            ]
        }
    });

    res.json(courses);
}));

//get individual course + user
router.get('/courses/:id', asyncHandler(async(req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                as: 'userInfo',
                attributes: {
                    exclude: [
                        'password',
                        'createdAt',
                        'updatedAt'
                    ]
                }
            }
        ],
        attributes: {
            exclude: [
                'createdAt',
                'updatedAt'
            ]
        }
    });

    res.json(course);
}));

// create new course (protected route)
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const course = await Course.create(req.body);

        res.status(201).location(`api/courses/${course.id}`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors })
        } else {
            throw error; //punt to global error handler
        }
    }
}));

// edit course 
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {  //if course exists... 
            if (req.currentUser.id === course.userId) { // ...determine if user can update
                await Course.update(
                    { 
                        title: req.body.title,
                        description: req.body.description,
                        estimatedTime: req.body.estimatedTime,
                        materialsNeeded: req.body.materialsNeeded 
                    },
                    {
                        where: {
                            id: req.params.id
                        }
                    });
                res.status(204).end();
            } else {
                res.status(403).json('Access Denied.');
            }
        } else {
            res.status(404).end(); //user typed in a nonexistent id
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error; //punt to global error handler
        }
    }
}));

//delete course (protected route)
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    const course = await Course.findByPk(req.params.id);

    if (req.currentUser.id === course.userId) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(403).json('Access Denied.');
    }
}));

module.exports = router;