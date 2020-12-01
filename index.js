const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key');
const cookieParsre = require('cookie-parser'); 

const { auth } = require('./middleware/auth');


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

app.post('/api/users/login', (req, res) => {


    //��û�� �̸����� db���� �ִ��� ã�´�. 
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "������ �̸����� ���� ������ �����ϴ�. No email user"
            })
        }
        //��û�� �̸����� db�� �ִٸ�, ��й�ȣ�� �´� ��й�ȣ���� Ȯ��
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) 
                return res.json({loginSuccess: false, message: "��й�ȣ�� Ʋ�Ƚ��ϴ�. Incorrect PAssword"})
            
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

/*
app.get('/api/users/auth',auth, (req,res) => {            //auth -- /auth�� �� (Req,res) �ϱ� ���� �ϴ� ��
    
    //������� �̵��� ����� �Ӵٴ� ���� authentification�� true��� ��.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0? false : true,  
        isAuth:true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })  
})
*/
app.get('/api/users/auth', auth, (req, res) => {
    //���� ���� �̵��� ����� �Դٴ� ����  Authentication �� True ��� ��.
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
    })
  })
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id:req.user._id}, 
    {token :""} //��ū�� ������
    , (err,user) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success:true
        })
    })
})



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))