const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async function (req, res, next) {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'thisIsTheKeyValue')
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token=token
        console.log(req.token)

        req.user = user
        next()
    }
    catch (e) {
        res.status(401).send({ error: 'could not authenticate' })
    }
}

module.exports = auth
