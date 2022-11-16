require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBSession = require('connect-mongodb-session')(session)
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");

const UserModel = require("./models/User.model")

const PORT = process.env.PORT || 8080;

const app = express();

///////////////// Conexión MONGO DB /////////////////////////////////
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,   
  useUnifiedTopology: true
}).then( res => console.log('Base de datos lista para usar!!'))
  .catch( err => console.log(`Error: ${err.message}`)) 
/////////////////////////////////////////////////////////////////////
const store = new MongoDBSession({
  uri: process.env.MONGO_URI,
  collection: 'mySessions'
})
/////////////////////////////////////////////////////////////////////

app.use(express.static('public'))
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'miPalabraSecreta',
    resave: false,
    saveUninitialized: false,  
    store: store,  
    cookie: { maxAge: 60000000 }
}))
app.use(express.json());

app.get('/register', (req, res) => {
  res.redirect('./register.html')
});

app.get('/index', (req, res) => {

  if(req.session.user?.username || req.cookies.user_sid){
    return res.status(200).send({status: 'ok', username: req.session.user?.username})    
  }else {
    return res.status(400).send({status: 'error'})
  }  
});

app.get('/dashboard', (req, res) => {  

  if(!req.session.user?.username || !req.cookies.user_sid){
    return res.status(400).send({status: 'error'})
  }else {
    return res.status(200).send({status: 'ok', username: req.session.user?.username})
  }

});

app.post('/register', async (req, res) => {
  let { username, email, password } = req.body;
  
  try {
    let user = await UserModel.findOne({email})
  
    if(user) return res.status(400).send({status: 'error', msg: 'Email ya registrado'})

    user = await UserModel.findOne({username})
    if(user) return res.status(400).send({status: 'error', msg: 'Username ya registrado'})

    let hashedPassword = await bcrypt.hash(password, 12);

    user = await UserModel.create({
      username,
      email,
      password : hashedPassword
    })

    return res.status(200).send({status: 'ok', msg: 'Usuario creado con éxito'})

  } catch (error) {
    return res.status(400).send({status: 'error', msg: error.message})
  }
})

app.post('/login', async (req, res) =>{
  let {email, password} = req.body;

  try {
    let user = await UserModel.findOne({email})

    if(!user) return res.status(400).send({status: 'error', msg: 'Email no registrado'})

    const passCoincide = await bcrypt.compare(password, user.password)
    if(!passCoincide) return res.status(400).send({status: 'error', msg: 'Contraseña incorrecta'})

    req.session.user = user;
    return res.status(200).send({status: 'ok', msg: ''})    

  } catch (error) {
    return res.status(400).send({status: 'error', msg: error.message})
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send({ status: 'error', err: 'Error al desloguearse'})
    res.send({status: 'ok'})
})
})

app.listen(PORT, () => console.log(`Server up on port ${PORT}`))