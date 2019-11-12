const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

//! different route approach then "task.js" file
const router = new express.Router()

//*************************************!    CREATE USER   ****************************************
router.post("/user", async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken()
        await user.save();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

//*************************************!    LOGIN USER   ****************************************
router.post("/user/login", async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }
    catch (e) {
        res.status(400).send()
    }
})

//*************************************!    LOGOUT USER   ****************************************
router.post("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        console.log(req.user.tokens)
        res.status(201).send("successful")
    } catch (e) {
        res.status(500).send()
    }
})

//*************************************!    FIND PROFILE   ****************************************
router.get("/user/me", auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

// //*************************************!    FIND USER   ****************************************
// router.get("/user/:id", async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });

//*************************************!    update USER   ****************************************
router.patch('/user/me', auth, async (req, res) => {
    const userProperties = Object.keys(req.body)
    const allowedProperties = ["name", 'age', 'email', 'password']
    const validInput = userProperties.every((validProperty) => allowedProperties.includes(validProperty))
    if (!validInput) {
        return res.status(404).send("!invalid input")
    }
    try {
        // const user = await User.findById(req.params.id)
        userProperties.forEach((property) => req.user[property] = req.body[property])
        await req.user.save()
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(req.user)
    }
    catch (e) {
        res.send(e)
    }
})

//*************************************!    DELETE USER   ****************************************
router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    }
    catch (e) {
        res.send(400)
    }
})

module.exports = router