const { Router } = require('express')
const {Sequelize, sequelize} = require('../utils/database')
const router = Router()


const users = sequelize.define('users', {
    data: Sequelize.JSONB,
    money: Sequelize.DECIMAL
});


router.use('/auth', (req, res) => {
    console.log(req.user)
    return users.create({
        data: {
            "code": req.query
        },
        money: 0,
    }).then(function (users) {
        if (users) {
            res.send(users);
        } else {
            res.status(400).send('Error in insert new record');
        }
    });
}) 


module.exports = router