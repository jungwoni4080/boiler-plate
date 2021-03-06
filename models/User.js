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
        maxlength: 60
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
    // 비밀번호를 암호화 시킴.

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
    //plainPassword 1234567 암호화된 비밀번호 ~~~~~~blabla
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
            cb(null, isMatch)   
    })
}

userSchema.methods.generateToken = function(cb) {
    
    var user = this;

    //jsonwebToken을 이용해서 토큰을 생성하기 
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err,user) {
        if(err) return cb(err)
        cb(null, user)
    })
    
}


userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    
    //토큰을 decode 함

    jwt.verify(token, 'secretToken', function(err,decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음
        //클라이언트에서 가져온 토큰과 데이터베이스에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null,user)
        })
    })

}


const User = mongoose.model('User', userSchema)

module.exports = { User }