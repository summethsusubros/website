const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require("mongoose");
const passport = require('passport');
const responseTime = require('response-time');
const redis = require('redis-promisify');

const User = require('./models/User');
require('./auth');
const authRoutes = require('./routes/authRoute');
const vaRoutes = require('./routes/vaRoute');
const adminRoutes = require('./routes/adminRoute');


const client = redis.createClient(process.env.REDIS_URL);
client.on("error", function (err) {
  console.log("Error " + err);
  console.log("______________  Redis Crashed  ______________");
});


const PORT = 80;
let URL = process.env.MONGODB_URL;
mongoose.connect(URL, {useNewUrlParser: true,useUnifiedTopology: true,}) 
  .then(result => {
    app.listen(PORT);
    console.log("______________  MongoDB connected  ______________");
    console.log("______________  App Started  ______________");
  })
  .catch(err => console.log(err));

  
// express app
const app = express();
app.use(express.static('public'));
app.use(responseTime());
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');

//sessions
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use(authRoutes);
app.use(vaRoutes);
app.use(adminRoutes);
//admin routes

// 404 page
app.use((req, res) => {
  if(req.user)
  User.findOne({email:req.user.email}, "role",  (err, result) => {
    if (err) return handleError(err);
    res.render('404',{title: '404 Error',  currentUser: req.user?req.user:"", role: result.role[0]});
  });
  else
    res.render('404',{title: '404 Error',  currentUser: req.user?req.user:"", role: ""});
});