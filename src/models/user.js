const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON=function(){
    const user=this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisIsTheKeyValue')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token    
}

userSchema.statics.findByCredential = async (email, password) => {
    const isUser = await User.findOne({ email })

    if (!isUser) {
        throw new Error("! invalid credentials")
    }
    const isMatch = await bcrypt.compare(password, isUser.password)
    if (!isMatch) { 
        throw new Error("wrong password entered")
    }
    return isUser
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
        next()
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User