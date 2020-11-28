const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10

const jwt=require('jsonwebtoken');

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
        type: Number
    }



})


userSchema.pre('save', function( next ){
    var user = this;
    // ��й�ȣ�� ��ȣȭ ��Ŵ.

    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
                // Store hash in your password DB.
            });
        });
    } else {
        next()
    }



})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 1234567 ��ȣȭ�� ��й�ȣ ~~~~~~blabla
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err),
            cb(null, isMatch)   
    })
}

userSchema.methods.generateToken = function(cb) {
    
    var user = this

    //jsonwebToken�� �̿��ؼ� ��ū�� �����ϱ� 
    var token = jwt.sign(uswer._id, 'secretToken')

    user.token = token
    user.save(function(err,user) {
        if(err) return cb(error)
        cb(null, user)
    })
    
}


const User = mongoose.model('User', userSchema)

module.exports = { User }