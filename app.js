const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");

const UserModel = require("./models/User.model")

const PORT = process.env.PORT || 8080;
const mongoURL = 'mongodb://localhost:27017/aae-sesiones';

const app = express();

///////////////// Conexión MONGO DB /////////////////////////////////
mongoose.connect(mongoURL, {
  useNewUrlParser: true,   
  useUnifiedTopology: true
}).then( res => console.log('Base de datos conectada!!'))
/////////////////////////////////////////////////////////////////////

app.use(express.static('public'))
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'miPalabraSecreta',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 }
}))
app.use(express.json());

app.post('/register', async (req, res) => {
  let { username, email, password } = req.body;
  
  try {
    let user = await UserModel.findOne({email})
  
    if(user) return res.status(400).send({status: 'error', msg: 'Email ya registrado'})

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

app.listen(PORT, () => console.log(`Server up on port ${PORT}`))