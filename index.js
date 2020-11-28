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

    //ȸ�������� �� �ʿ��� �������� client���� ��������

    //�װ͵��� �����ͺ��̽��� �־���.



    
    const user = new User(req.body)
    
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login', (req, res) => {


    //��û�� �̸����� db���� �ִ��� ã�´�. 
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "������ �̸����� ���� ������ �����ϴ�."
            })
        }
        //��û�� �̸����� db�� �ִٸ�, ��й�ȣ�� �´� ��й�ȣ���� Ȯ��
        user.comParePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) 
                return res.json({loginSuccess: false, message: "��й�ȣ�� Ʋ�Ƚ��ϴ�."})
            
            //��й�ȣ�� �´ٸ�, ��ū�� ������
            user.generateToken((err, user) => {
            
                if(err) return res.status(400).send(err);
                
                //��ū�� �����Ѵ�. ���? => ��Ű, ���ý��丮��, ��... => �ٵ� ��Ű�� ����
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true,  userId: user._id}) 
            })
        })
    })
})




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
