const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trin: true, //john ahn@naver.com => johnahn@naver.com
        unique: 1
    },
    password: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image : String,
    Token: {
        type: String 
    },
    tokenExp: {
        type: number
    }



})

const User = mongoose.model('User', userSchema)

module.exports = { User }