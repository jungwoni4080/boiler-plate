const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key');
const cookieParsre = require('cookie-parser'); 

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());


app.use(cookieParsre());


const mongoose = require('mongoose');
const { response } = require('express');


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))







app.get('/', (req, res) => res.send('Hello World!~saehaebok~'))




app.post('/register', (req, res) => {

    //회원가입할 때 필요한 정보들을 client에서 가져오면

    //그것들을 데이터베이스에 넣어줌.



    
    const user = new User(req.body)
    
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {


    //요청된 이메일을 db에서 있는지 찾는다. 
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일을 가진 유저는 없습니다."
            })
        }
        //요청된 이메일이 db에 있다면, 비밀번호가 맞는 비밀번호인지 확인
        user.comParePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) 
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            
            //비밀번호가 맞다면, 토큰을 생성함
            user.generateToken((err, user) => {
            
                if(err) return res.status(400).send(err);
                
                //토큰을 저장한다. 어디에? => 쿠키, 로컬스토리지, 등... => 근데 쿠키에 저장
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true,  userId: user._id}) 
            })
        })
    })
})




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
